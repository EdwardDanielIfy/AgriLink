package com.agrilink.payment;

import com.agrilink.payment.dto.PaymentInitializeResponse;
import com.agrilink.payment.dto.PaystackWebhookEvent;
import com.agrilink.payment.exceptions.PaymentException;
import com.agrilink.shared.BuyerDetailsProvider;
import com.agrilink.shared.enums.BankCode;
import com.agrilink.transaction.Transaction;
import com.agrilink.transaction.TransactionServices;
import com.agrilink.transaction.TransactionStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServices {

    private final TransactionServices transactionServices;
    private final ObjectMapper objectMapper;
    private final BuyerDetailsProvider buyerDetailsProvider;

    @Value("${paystack.secret-key}")
    private String paystackSecretKey;

    @Value("${paystack.base-url}")
    private String paystackBaseUrl;

    public PaymentInitializeResponse initializePayment(String transactionId) {
        try {
            Transaction transaction = transactionServices.findById(transactionId);

            if (transaction.getStatus() != TransactionStatus.ACCEPTED) {
                throw new PaymentException(
                        "Cannot initialize payment. Offer has not been accepted yet."
                );
            }

            long amountInKobo = (long) (transaction.getOfferedPrice() * transaction.getQuantitySold() * 100);

            String buyerEmail = buyerDetailsProvider.getBuyerEmail(transaction.getBuyerId());
            String emailToUse = (buyerEmail != null && !buyerEmail.trim().isEmpty()) ? buyerEmail : "buyer_" + transaction.getBuyerId() + "@agrilink.local";

            String paystackReference = transaction.getTransactionId() + "_" + System.currentTimeMillis();

            String requestBody = objectMapper.writeValueAsString(new java.util.HashMap<>() {{
                put("email", emailToUse); // fallback for phone-only logins
                put("amount", amountInKobo);
                put("reference", paystackReference);
                put("callback_url", "https://agrilink.com/payment/callback");
                put("metadata", new java.util.HashMap<>() {{
                    put("transaction_id", transactionId);
                }});
            }});

            log.info("Initializing Paystack payment for transaction: {}. Amount: {} kobo. Email: {}. Reference: {}", 
                    transactionId, amountInKobo, emailToUse, paystackReference);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(paystackBaseUrl + "/transaction/initialize"))
                    .header("Authorization", "Bearer " + paystackSecretKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            log.info("Paystack response status: {}. Body: {}", response.statusCode(), response.body());

            if (response.statusCode() != 200) {
                throw new PaymentException("Paystack initialization failed (" + response.statusCode() + "): "
                        + response.body());
            }

            var responseMap = objectMapper.readValue(response.body(),
                    java.util.Map.class);
            var data = (java.util.Map<?, ?>) responseMap.get("data");

            PaymentInitializeResponse result = new PaymentInitializeResponse();
            result.setTransactionId(transactionId);
            result.setAuthorizationUrl((String) data.get("authorization_url"));
            result.setReference((String) data.get("reference"));
            result.setStatus("pending");

            log.info("Payment initialized for transaction: {} with unique reference: {}", transactionId, paystackReference);
            return result;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to initialize payment for transaction: {}",
                    transactionId, e);
            throw new PaymentException("Payment initialization failed: "
                    + e.getMessage());
        }
    }

    public void handleWebhook(String payload, String paystackSignature) {
        try {
            if (!verifyWebhookSignature(payload, paystackSignature)) {
                log.warn("Invalid Paystack webhook signature — ignoring");
                return;
            }

            PaystackWebhookEvent event = objectMapper.readValue(payload, PaystackWebhookEvent.class);

            log.info("Paystack webhook received: event={}", event.getEvent());

            if ("charge.success".equals(event.getEvent())) {
                String reference = event.getData().getReference();
                String transactionId = (String) event.getData().getMetadata().get("transaction_id");
                
                if (transactionId == null) {
                    log.warn("Webhook received without transaction_id metadata for reference: {}", reference);
                    return;
                }

                transactionServices.confirmPayment(transactionId, reference);
                log.info("Payment confirmed for transaction: {} with reference: {}", transactionId, reference);
            }

        } catch (Exception e) {
            log.error("Failed to process Paystack webhook", e);
        }
    }

    public void processFarmerPayout(String transactionId) {
        try {
            Transaction transaction = transactionServices.findById(transactionId);

            if (transaction.getStatus() != TransactionStatus.DELIVERED) {
                throw new PaymentException("Cannot process payout. Delivery not confirmed yet.");
            }

            String recipientCode = createTransferRecipient(transaction);
            initiateTransfer(transaction, recipientCode);
            transactionServices.processPayout(transactionId);
            log.info("Farmer payout processed for transaction: {}", transactionId);

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to process farmer payout for transaction: {}",
                    transactionId, e);
            throw new PaymentException("Payout failed: " + e.getMessage());
        }
    }

    private String createTransferRecipient(Transaction transaction) throws Exception {
        var farmer = transactionServices.getFarmerForTransaction(transaction.getFarmerId());

        String bankCode = BankCode.fromDisplayName(farmer.getBankName()).getCode();

        String requestBody = objectMapper.writeValueAsString(
                new HashMap<>() {{
                    put("type", "nuban");
                    put("name", farmer.getBankAccountName());
                    put("account_number", farmer.getBankAccountNumber());
                    put("bank_code", bankCode);
                    put("currency", "NGN");
                }});

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(paystackBaseUrl + "/transferrecipient"))
                .header("Authorization", "Bearer " + paystackSecretKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        var responseMap = objectMapper.readValue(response.body(),
                java.util.Map.class);
        var data = (java.util.Map<?, ?>) responseMap.get("data");

        return (String) data.get("recipient_code");
    }

    private void initiateTransfer(Transaction transaction, String recipientCode) throws Exception {
        long amountInKobo = (long) (transaction.getFarmerNetPayout() * 100);

        String requestBody = objectMapper.writeValueAsString(
                new java.util.HashMap<>() {{
                    put("source", "balance");
                    put("amount", amountInKobo);
                    put("recipient", recipientCode);
                    put("reason", "AgriLink payout for transaction: "
                            + transaction.getTransactionId());
                }});

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(paystackBaseUrl + "/transfer"))
                .header("Authorization", "Bearer " + paystackSecretKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new PaymentException("Paystack transfer failed: " + response.body());
        }

        log.info("Transfer initiated to farmer for transaction: {}",
                transaction.getTransactionId());
    }

    private boolean verifyWebhookSignature(String payload, String paystackSignature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(paystackSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedSignature = HexFormat.of().formatHex(hash);
            return computedSignature.equals(paystackSignature);
        } catch (Exception e) {
            log.error("Failed to verify webhook signature", e);
            return false;
        }
    }

    public List<String> getAvailableBanks() {
        return Arrays.stream(BankCode.values())
                .map(BankCode::getDisplayName)
                .collect(Collectors.toList());
    }

}
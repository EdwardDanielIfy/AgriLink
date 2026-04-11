package com.agrilink.transaction;

import com.agrilink.buyer.BuyerServices;
import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.FarmerServices;
import com.agrilink.produce.ProduceServices;
import com.agrilink.shared.events.TransactionStatusChangedEvent;
import com.agrilink.transaction.dto.TransactionRequest;
import com.agrilink.transaction.dto.TransactionResponse;
import com.agrilink.transaction.exceptions.InvalidTransactionStateException;
import com.agrilink.transaction.exceptions.TransactionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServices {

    private final TransactionRepository transactionRepository;
    private final ProduceServices produceServices;
    private final FarmerServices farmerServices;
    private final BuyerServices buyerServices;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${agrilink.commission-rate}")
    private Double commissionRate;

    public TransactionResponse makeOffer(TransactionRequest request) {

        produceServices.findById(request.getProduceId());
        buyerServices.findById(request.getBuyerId());
        farmerServices.findById(request.getFarmerId());
        produceServices.markAsOfferPending(request.getProduceId());

        Transaction transaction = new Transaction();
        transaction.setProduceId(request.getProduceId());
        transaction.setFarmerId(request.getFarmerId());
        transaction.setBuyerId(request.getBuyerId());
        transaction.setOfferedPrice(request.getOfferedPrice());
        transaction.setQuantitySold(request.getQuantitySold());
        transaction.setLogisticsPartner(request.getLogisticsPartner());

        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse confirmDelivery(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.IN_TRANSIT) {
            throw new InvalidTransactionStateException("Cannot confirm delivery. Transaction is not in transit.");
        }

        transaction.setStatus(TransactionStatus.DELIVERED);
        transaction.setDeliveredAt(LocalDateTime.now());
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse acceptOffer(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.AWAITING_RESPONSE) {
            throw new InvalidTransactionStateException("Cannot accept offer. Transaction is not awaiting response.");
        }

        transaction.setStatus(TransactionStatus.ACCEPTED);
        produceServices.markAsSold(transaction.getProduceId());
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse rejectOffer(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.AWAITING_RESPONSE) {
            throw new InvalidTransactionStateException("Cannot reject offer. Transaction is not awaiting response.");
        }

        transaction.setStatus(TransactionStatus.REJECTED);
        produceServices.markAsAvailable(transaction.getProduceId());
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse confirmPayment(String transactionId, String paymentReference) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.ACCEPTED) {
            throw new InvalidTransactionStateException("Cannot confirm payment. Offer has not been accepted yet.");
        }

        transaction.setStatus(TransactionStatus.PAYMENT_CONFIRMED);
        transaction.setPaymentReference(paymentReference);
        transaction.setPaymentConfirmedAt(LocalDateTime.now());
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse arrangeLogistics(String transactionId, String logisticsPartner, String trackingNumber) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.PAYMENT_CONFIRMED) {
            throw new InvalidTransactionStateException("Cannot arrange logistics. Payment has not been confirmed yet.");
        }

        transaction.setStatus(TransactionStatus.LOGISTICS_ARRANGED);
        transaction.setLogisticsPartner(logisticsPartner);
        transaction.setLogisticsTrackingNumber(trackingNumber);
        transaction.setLogisticsConfirmedAt(LocalDateTime.now());
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse markInTransit(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.LOGISTICS_ARRANGED) {
            throw new InvalidTransactionStateException("Cannot mark in transit. Logistics have not been arranged yet.");
        }

        transaction.setStatus(TransactionStatus.IN_TRANSIT);
        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public TransactionResponse processPayout(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        if (transaction.getStatus() != TransactionStatus.DELIVERED) {
            throw new InvalidTransactionStateException("Cannot process payout. Delivery has not been confirmed yet.");
        }

        transaction.setStatus(TransactionStatus.PAYOUT_PROCESSING);

        double saleAmount = transaction.getOfferedPrice() * transaction.getQuantitySold();
        double commission = saleAmount * commissionRate;
        double storageCost = farmerServices.findById(transaction.getFarmerId()).getStorageDebt();
        double netPayout = saleAmount - commission - storageCost;

        transaction.setCommissionAmount(commission);
        transaction.setStorageCostDeducted(storageCost);
        transaction.setFarmerNetPayout(netPayout);
        transaction.setStatus(TransactionStatus.COMPLETE);
        transaction.setPaidToFarmerAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);

        eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, saved.getTransactionId(), saved.getStatus()));

        return mapToResponse(saved);
    }

    public void expireOverdueTransactions() {
        List<Transaction> overdue = transactionRepository.findByStatusAndOfferResponseDeadlineBefore(TransactionStatus.AWAITING_RESPONSE, LocalDateTime.now());

        for (Transaction transaction : overdue) {
            transaction.setStatus(TransactionStatus.EXPIRED);
            produceServices.markAsAvailable(transaction.getProduceId());
            transactionRepository.save(transaction);

            eventPublisher.publishEvent(new TransactionStatusChangedEvent(this, transaction.getTransactionId(), transaction.getStatus()));
        }
    }

    public TransactionResponse getTransactionById(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));
        return mapToResponse(transaction);
    }

    public List<TransactionResponse> getTransactionsByFarmer(String farmerId) {
        return transactionRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByBuyer(String buyerId) {
        return transactionRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByAgent(String agentId) {
        return transactionRepository.findByAgentId(agentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Transaction findById(String transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────────

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionId(transaction.getTransactionId())
                .produceId(transaction.getProduceId())
                .farmerId(transaction.getFarmerId())
                .buyerId(transaction.getBuyerId())
                .agentId(transaction.getAgentId())
                .status(transaction.getStatus())
                .offeredPrice(transaction.getOfferedPrice())
                .quantitySold(transaction.getQuantitySold())
                .commissionAmount(transaction.getCommissionAmount())
                .storageCostDeducted(transaction.getStorageCostDeducted())
                .farmerNetPayout(transaction.getFarmerNetPayout())
                .logisticsPartner(transaction.getLogisticsPartner())
                .logisticsTrackingNumber(transaction.getLogisticsTrackingNumber())
                .paymentReference(transaction.getPaymentReference())
                .offerResponseDeadline(transaction.getOfferResponseDeadline())
                .paymentConfirmedAt(transaction.getPaymentConfirmedAt())
                .logisticsConfirmedAt(transaction.getLogisticsConfirmedAt())
                .deliveredAt(transaction.getDeliveredAt())
                .paidToFarmerAt(transaction.getPaidToFarmerAt())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    public String findAwaitingResponseTransactionByPhone(String phoneNumber) {
        Farmer farmer = farmerServices.findByPhoneNumber(phoneNumber);
        return transactionRepository
                .findByFarmerIdAndStatus(farmer.getFarmerId(), TransactionStatus.AWAITING_RESPONSE)
                .stream()
                .findFirst()
                .map(Transaction::getTransactionId)
                .orElse(null);
    }
}

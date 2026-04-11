package com.agrilink.buyer;

import com.agrilink.buyer.dto.*;
import com.agrilink.buyer.exceptions.BuyerNotFoundException;
import com.agrilink.buyer.exceptions.DuplicateBuyerPhoneException;
import com.agrilink.shared.exceptions.InvalidOperationException;
import com.agrilink.shared.dto.ChangePasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyerServices {

    private final BuyerRepository buyerRepository;
    private final PasswordEncoder passwordEncoder;

    public BuyerResponse register(BuyerRegisterRequest request) {
        if (buyerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateBuyerPhoneException(request.getPhoneNumber());
        }

        Buyer buyer = new Buyer();
        buyer.setFullName(request.getFullName());
        buyer.setPhoneNumber(request.getPhoneNumber());
        buyer.setEmail(request.getEmail());
        buyer.setPassword(passwordEncoder.encode(request.getPassword()));
        buyer.setBusinessName(request.getBusinessName());
        buyer.setLocation(request.getLocation());

        return mapToResponse(buyerRepository.save(buyer));
    }

    public String login(String phoneNumber, String password) {
        Buyer buyer = buyerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new BuyerNotFoundException(phoneNumber));

        if (!passwordEncoder.matches(password, buyer.getPassword())) {
            throw new InvalidOperationException("Invalid phone number or password");
        }

        return "Login successful";
    }

    public void changePassword(String buyerId, ChangePasswordRequest request) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new BuyerNotFoundException(buyerId));

        if (!passwordEncoder.matches(request.getOldPassword(), buyer.getPassword())) {
            throw new InvalidOperationException("Current password is incorrect");
        }

        buyer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        buyerRepository.save(buyer);
    }

    public BuyerResponse getMyProfile(String buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new BuyerNotFoundException(buyerId));
        return mapToResponse(buyer);
    }

    public BuyerResponse updateMyInfo(String buyerId, UpdateBuyerRequest request) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new BuyerNotFoundException(buyerId));

        if (request.getFullName() != null) {
            buyer.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            buyer.setEmail(request.getEmail());
        }
        if (request.getBusinessName() != null) {
            buyer.setBusinessName(request.getBusinessName());
        }
        if (request.getLocation() != null) {
            buyer.setLocation(request.getLocation());
        }

        return mapToResponse(buyerRepository.save(buyer));
    }

    public Buyer findById(String buyerId) {
        return buyerRepository.findById(buyerId)
                .orElseThrow(() -> new BuyerNotFoundException(buyerId));
    }

    private BuyerResponse mapToResponse(Buyer buyer) {
        return BuyerResponse.builder()
                .buyerId(buyer.getBuyerId())
                .fullName(buyer.getFullName())
                .phoneNumber(buyer.getPhoneNumber())
                .email(buyer.getEmail())
                .businessName(buyer.getBusinessName())
                .location(buyer.getLocation())
                .registeredAt(buyer.getRegisteredAt())
                .build();
    }
}

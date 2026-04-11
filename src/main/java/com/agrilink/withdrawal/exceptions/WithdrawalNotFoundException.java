package com.agrilink.withdrawal.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class WithdrawalNotFoundException extends ResourceNotFoundException {

    public WithdrawalNotFoundException(String withdrawalId) {
        super("Withdrawal with id: " + withdrawalId + "not found");
    }
}
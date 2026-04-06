package com.agrilink.farmer.exceptions;

import com.agrilink.shared.exceptions.DuplicateResourceException;

    public class DuplicateFarmerPhoneException extends DuplicateResourceException {

        public DuplicateFarmerPhoneException(String phone) {
            super("A farmer with phone number " + phone + " already exists");
        }
    }


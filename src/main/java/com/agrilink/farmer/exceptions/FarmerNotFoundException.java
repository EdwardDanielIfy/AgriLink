package com.agrilink.farmer.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class FarmerNotFoundException extends ResourceNotFoundException {

        public FarmerNotFoundException(String farmerId) {
            super("Farmer not found with id: " + farmerId);
        }
}


package com.agrilink.storage.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class StorageNotFoundException extends ResourceNotFoundException {

    public StorageNotFoundException(String storageId) {
        super("Storage facility not found with id: " + storageId);
    }
}

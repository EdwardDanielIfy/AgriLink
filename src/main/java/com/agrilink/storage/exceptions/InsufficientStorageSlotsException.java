package com.agrilink.storage.exceptions;

import com.agrilink.shared.exceptions.InvalidOperationException;

public class InsufficientStorageSlotsException extends InvalidOperationException {

    public InsufficientStorageSlotsException(String storageName) {
        super("Storage facility '" + storageName + "' has no available slots");
    }
}

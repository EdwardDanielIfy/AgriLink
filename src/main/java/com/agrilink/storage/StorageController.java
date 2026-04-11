package com.agrilink.storage;

import com.agrilink.storage.dto.StorageRequest;
import com.agrilink.shared.APIResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageServices storageServices;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> registerStorage(@Valid @RequestBody StorageRequest request) {
        return new ResponseEntity<>(new APIResponse(true, storageServices.registerStorage(request)), HttpStatus.CREATED);
    }

    @GetMapping("/{storageId}")
    public ResponseEntity<APIResponse> getStorageById(@PathVariable String storageId) {
        return new ResponseEntity<>(new APIResponse(true, storageServices.getStorageById(storageId)), HttpStatus.OK);
    }

    @GetMapping("/territory/{territory}")
    public ResponseEntity<APIResponse> getStorageByTerritory(@PathVariable String territory) {
        return new ResponseEntity<>(new APIResponse(true, storageServices.getStorageByTerritory(territory)), HttpStatus.OK);
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<APIResponse> getStorageByAgent(@PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, storageServices.getStorageByAgent(agentId)), HttpStatus.OK);
    }

    @GetMapping("/partner/{partnerName}")
    public ResponseEntity<APIResponse> getStorageByPartner(@PathVariable String partnerName) {
        return new ResponseEntity<>(new APIResponse(true, storageServices.getStorageByPartner(partnerName)), HttpStatus.OK);
    }
}

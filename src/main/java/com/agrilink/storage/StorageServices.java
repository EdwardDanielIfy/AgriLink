package com.agrilink.storage;

import com.agrilink.agent.services.AgentServices;
import com.agrilink.shared.ProduceCountProvider;
import com.agrilink.shared.StorageCountProvider;
import com.agrilink.storage.dto.StorageRequest;
import com.agrilink.storage.dto.StorageResponse;

import com.agrilink.storage.exceptions.StorageNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StorageServices implements StorageCountProvider {

    private final StorageRepository storageRepository;
    private final AgentServices agentServices;
    private final ProduceCountProvider produceCountProvider;

    public StorageResponse registerStorage(StorageRequest request) {
        agentServices.findById(request.getManagedByAgentId());

        Storage storage = new Storage();
        storage.setName(request.getName());
        storage.setLocation(request.getLocation());
        storage.setTerritory(request.getTerritory());
        storage.setPartnerName(request.getPartnerName());
        storage.setPartnerFacilityId(request.getPartnerFacilityId());
        storage.setContactPhone(request.getContactPhone());
        storage.setCapacity(request.getCapacity());
        storage.setCostPerDay(request.getCostPerDay());
        storage.setManagedByAgentId(request.getManagedByAgentId());

        return mapToResponse(storageRepository.save(storage), 0);
    }

    public StorageResponse getStorageById(String storageId) {
        Storage storage = storageRepository.findById(storageId)
                .orElseThrow(() -> new StorageNotFoundException(storageId));
        int activeCount = getActiveProduceCount(storageId);
        return mapToResponse(storage, activeCount);
    }

    public List<StorageResponse> getStorageByTerritory(String territory) {
        return storageRepository.findByTerritory(territory)
                .stream()
                .map(storage -> mapToResponse(storage, getActiveProduceCount(storage.getStorageId())))
                .collect(Collectors.toList());
    }

    public List<StorageResponse> getStorageByAgent(String agentId) {
        return storageRepository.findByManagedByAgentId(agentId)
                .stream()
                .map(storage -> mapToResponse(storage, getActiveProduceCount(storage.getStorageId())))
                .collect(Collectors.toList());
    }

    public List<StorageResponse> getStorageByPartner(String partnerName) {
        return storageRepository.findByPartnerName(partnerName)
                .stream()
                .map(storage -> mapToResponse(storage, getActiveProduceCount(storage.getStorageId())))
                .collect(Collectors.toList());
    }

    public Storage findById(String storageId) {
        return storageRepository.findById(storageId)
                .orElseThrow(() -> new StorageNotFoundException(storageId));
    }

    private int getActiveProduceCount(String storageId) {
        return produceCountProvider.countActiveProduceByStorageId(storageId);
    }

    private StorageResponse mapToResponse(Storage storage, int activeProduceCount) {
        return StorageResponse.builder()
                .storageId(storage.getStorageId())
                .name(storage.getName())
                .location(storage.getLocation())
                .territory(storage.getTerritory())
                .partnerName(storage.getPartnerName())
                .partnerFacilityId(storage.getPartnerFacilityId())
                .contactPhone(storage.getContactPhone())
                .capacity(storage.getCapacity())
                .availableSlots(storage.getCapacity() - activeProduceCount)
                .costPerDay(storage.getCostPerDay())
                .managedByAgentId(storage.getManagedByAgentId())
                .createdAt(storage.getCreatedAt())
                .build();
    }

    @Override
    public int getStorageCountByAgent(String agentId) {
        return storageRepository.findByManagedByAgentId(agentId).size();
    }
}
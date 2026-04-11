package com.agrilink.produce;

import com.agrilink.agent.services.AgentServices;
import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.FarmerServices;
import com.agrilink.produce.dto.ProduceRequest;
import com.agrilink.produce.dto.ProduceResponse;
import com.agrilink.produce.exceptions.ProduceNotAvailableException;
import com.agrilink.produce.exceptions.ProduceNotFoundException;
import com.agrilink.shared.ProduceCountProvider;
import com.agrilink.shared.enums.ProduceStatus;
import com.agrilink.shared.exceptions.UnauthorizedActionException;
import com.agrilink.storage.Storage;
import com.agrilink.storage.StorageRepository;
import com.agrilink.storage.exceptions.InsufficientStorageSlotsException;
import com.agrilink.storage.exceptions.StorageNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProduceServices implements ProduceCountProvider {

    private final ProduceRepository produceRepository;
    private final FarmerServices farmerServices;
    private final AgentServices agentServices;
    private final StorageRepository storageRepository;

    public ProduceResponse logProduceByAgent(String agentId, String farmerId, ProduceRequest request) {
        agentServices.findById(agentId);
        farmerServices.getFarmerByIdForAgent(farmerId, agentId);
        validateSlotAvailability(request.getStorageId());
        request.setAgentId(agentId);
        request.setFarmerId(farmerId);

        return saveProduce(request);
    }

    public ProduceResponse logProduceByFarmer(String farmerId, ProduceRequest request) {
        Farmer farmer = farmerServices.findById(farmerId);

        if (!farmer.getHasAppAccess()) {
            throw new UnauthorizedActionException(
                    "This farmer does not have app access to log produce directly"
            );
        }
        validateSlotAvailability(request.getStorageId());

        request.setFarmerId(farmerId);
        request.setAgentId(null);

        return saveProduce(request);
    }

    public ProduceResponse getProduceById(String produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));
        return mapToResponse(produce);
    }

    public List<ProduceResponse> getProduceByFarmer(String farmerId) {
        return produceRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProduceResponse> getAvailableProduceByFarmer(String farmerId) {
        return produceRepository.findByFarmerIdAndStatus(farmerId, ProduceStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProduceResponse> getProduceByStorage(String storageId) {
        return produceRepository.findByStorageId(storageId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProduceResponse> getProduceByType(String produceType) {
        return produceRepository.findByProduceType(produceType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProduceResponse> getAvailableProduce() {
        return produceRepository.findByStatus(ProduceStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void markAsOfferPending(String produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));

        if (produce.getStatus() != ProduceStatus.AVAILABLE) {
            throw new ProduceNotAvailableException(produceId);
        }

        produce.setStatus(ProduceStatus.OFFER_PENDING);
        produceRepository.save(produce);
    }

    public void markAsSold(String produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));

        if (produce.getStatus() != ProduceStatus.OFFER_PENDING) {
            throw new ProduceNotAvailableException(produceId);
        }

        produce.setStatus(ProduceStatus.SOLD);
        produceRepository.save(produce);
    }

    public void markAsWithdrawn(String produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));

        if (produce.getStatus() == ProduceStatus.SOLD) {
            throw new ProduceNotAvailableException(produceId);
        }

        if (produce.getStatus() == ProduceStatus.WITHDRAWN) {
            throw new ProduceNotAvailableException(produceId);
        }

        produce.setStatus(ProduceStatus.WITHDRAWN);
        produceRepository.save(produce);
    }

    public void markAsAvailable(String produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));
        produce.setStatus(ProduceStatus.AVAILABLE);
        produceRepository.save(produce);
    }

    @Override
    public int countActiveProduceByStorageId(String storageId) {
        return produceRepository.countByStorageIdAndStatus(storageId, ProduceStatus.AVAILABLE)
                + produceRepository.countByStorageIdAndStatus(storageId, ProduceStatus.OFFER_PENDING);
    }

    public Produce findById(String produceId) {
        return produceRepository.findById(produceId)
                .orElseThrow(() -> new ProduceNotFoundException(produceId));
    }

    private void validateSlotAvailability(String storageId) {
        Storage storage = storageRepository.findById(storageId)
                .orElseThrow(() -> new StorageNotFoundException(storageId));
        int activeCount = countActiveProduceByStorageId(storageId);
        if (activeCount >= storage.getCapacity()) {
            throw new InsufficientStorageSlotsException(storage.getName());
        }
    }

    private ProduceResponse saveProduce(ProduceRequest request) {
        Produce produce = new Produce();
        produce.setFarmerId(request.getFarmerId());
        produce.setStorageId(request.getStorageId());
        produce.setAgentId(request.getAgentId());
        produce.setProduceType(request.getProduceType());
        produce.setQuantity(request.getQuantity());
        produce.setUnit(request.getUnit());
        produce.setGrade(request.getGrade());
        produce.setReferencePrice(request.getReferencePrice());
        produce.setExpectedPickupDate(request.getExpectedPickupDate());

        return mapToResponse(produceRepository.save(produce));
    }

    private ProduceResponse mapToResponse(Produce produce) {
        return ProduceResponse.builder()
                .produceId(produce.getProduceId())
                .farmerId(produce.getFarmerId())
                .storageId(produce.getStorageId())
                .agentId(produce.getAgentId())
                .produceType(produce.getProduceType())
                .quantity(produce.getQuantity())
                .unit(produce.getUnit())
                .grade(produce.getGrade())
                .referencePrice(produce.getReferencePrice())
                .status(produce.getStatus())
                .accruedStorageCost(produce.getAccruedStorageCost())
                .expectedPickupDate(produce.getExpectedPickupDate())
                .loggedAt(produce.getLoggedAt())
                .lastStorageCostUpdate(produce.getLastStorageCostUpdate())
                .build();
    }
}
package com.agrilink.marketplace;

import com.agrilink.marketplace.dto.ProduceListingResponse;
import com.agrilink.produce.Produce;
import com.agrilink.produce.ProduceRepository;
import com.agrilink.shared.enums.ProduceStatus;
import com.agrilink.storage.Storage;
import com.agrilink.storage.StorageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketPlaceServices {

    private final ProduceRepository produceRepository;
    private final StorageRepository storageRepository;
    private final com.agrilink.farmer.FarmerRepository farmerRepository;

    public List<ProduceListingResponse> getAllAvailableListings() {
        return produceRepository.findByStatusIn(List.of(
                ProduceStatus.AVAILABLE,
                ProduceStatus.PENDING_HUB_ASSIGNMENT,
                ProduceStatus.OFFER_PENDING))
                .stream()
                .map(this::mapToListing)
                .collect(Collectors.toList());
    }

    public List<ProduceListingResponse> getListingsByType(String produceType) {
        List<Produce> produceList = produceRepository.findByStatusIn(List.of(
                ProduceStatus.AVAILABLE,
                ProduceStatus.PENDING_HUB_ASSIGNMENT,
                ProduceStatus.OFFER_PENDING))
                .stream()
                .filter(produce -> produce.getProduceType().equalsIgnoreCase(produceType))
                .collect(Collectors.toList());

        List<ProduceListingResponse> listings = new ArrayList<>();
        for (Produce produce : produceList) {
            ProduceListingResponse listing = mapToListing(produce);
            if (listing != null) {
                listings.add(listing);
            }
        }
        return listings;
    }

    public List<ProduceListingResponse> getListingsByTerritory(String territory) {
        List<Storage> storagesInTerritory = storageRepository.findByTerritory(territory);

        List<ProduceListingResponse> listings = new ArrayList<>();

        for (Storage storage : storagesInTerritory) {
            List<Produce> produceInStorage = produceRepository.findByStatusIn(List.of(
                    ProduceStatus.AVAILABLE,
                    ProduceStatus.OFFER_PENDING))
                    .stream()
                    .filter(p -> storage.getStorageId().equals(p.getStorageId()))
                    .collect(Collectors.toList());

            for (Produce produce : produceInStorage) {
                ProduceListingResponse listing = mapToListing(produce);
                if (listing != null) {
                    listings.add(listing);
                }
            }
        }
        return listings;
    }

    public List<ProduceListingResponse> getListingsByPriceRange(Double minPrice, Double maxPrice) {
        List<Produce> produceList = produceRepository.findByStatusIn(List.of(
                ProduceStatus.AVAILABLE,
                ProduceStatus.PENDING_HUB_ASSIGNMENT,
                ProduceStatus.OFFER_PENDING))
                .stream()
                .filter(p -> p.getReferencePrice() != null && p.getReferencePrice() >= minPrice
                        && p.getReferencePrice() <= maxPrice)
                .collect(Collectors.toList());

        List<ProduceListingResponse> listings = new ArrayList<>();
        for (Produce produce : produceList) {
            ProduceListingResponse produceListing = mapToListing(produce);
            if (produceListing != null) {
                listings.add(produceListing);
            }
        }
        return listings;
    }

    private ProduceListingResponse mapToListing(Produce produce) {
        ProduceListingResponse.ProduceListingResponseBuilder builder = ProduceListingResponse.builder()
                .produceId(produce.getProduceId())
                .produceType(produce.getProduceType())
                .quantity(produce.getQuantity())
                .unit(produce.getUnit())
                .grade(produce.getGrade())
                .referencePrice(produce.getReferencePrice())
                .farmerId(produce.getFarmerId())
                .status(produce.getStatus());

        if (produce.getStorageId() != null && !produce.getStorageId().isEmpty()) {
            storageRepository.findById(produce.getStorageId()).ifPresent(storage -> {
                builder.storageLocation(storage.getLocation())
                       .territory(storage.getTerritory())
                       .partnerStorageName(storage.getPartnerName());
            });
        }
        
        // Fallback to farmer location if storage info is missing
        if (produce.getFarmerId() != null && !produce.getFarmerId().isEmpty()) {
            try {
                farmerRepository.findById(produce.getFarmerId()).ifPresent(farmer -> {
                    // Update only if still missing
                    ProduceListingResponse current = builder.build();
                    if (current.getTerritory() == null) {
                        builder.storageLocation(farmer.getLocation())
                               .territory(farmer.getLocation());
                    }
                });
            } catch (Exception e) {
                // Ignore farmer lookup failures
            }
        }

        return builder.build();
    }
}

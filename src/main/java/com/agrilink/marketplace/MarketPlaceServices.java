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
public class MarketPlaceServices{

    private final ProduceRepository produceRepository;
    private final StorageRepository storageRepository;

    public List<ProduceListingResponse> getAllAvailableListings() {
        return produceRepository.findByStatus(ProduceStatus.AVAILABLE)
                .stream()
                .map(this::mapToListing)
                .collect(Collectors.toList());
    }

    public List<ProduceListingResponse> getListingsByType(String produceType) {
        List<Produce> produceList = produceRepository.findByProduceTypeAndStatus(produceType, ProduceStatus.AVAILABLE);

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
            List<Produce> produceInStorage = produceRepository.findByStorageIdAndStatus(storage.getStorageId(), ProduceStatus.AVAILABLE);

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
        List<Produce> produceList = produceRepository.findByStatusAndReferencePriceBetween(ProduceStatus.AVAILABLE, minPrice, maxPrice);

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
        return storageRepository.findById(produce.getStorageId())
                .map(storage -> ProduceListingResponse.builder()
                        .produceId(produce.getProduceId())
                        .produceType(produce.getProduceType())
                        .quantity(produce.getQuantity())
                        .unit(produce.getUnit())
                        .grade(produce.getGrade())
                        .referencePrice(produce.getReferencePrice())
                        .storageLocation(storage.getLocation())
                        .territory(storage.getTerritory())
                        .partnerStorageName(storage.getPartnerName())
                        .build())
                .orElse(null);
    }
}

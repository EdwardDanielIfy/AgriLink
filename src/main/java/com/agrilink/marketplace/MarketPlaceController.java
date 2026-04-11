package com.agrilink.marketplace;

import com.agrilink.shared.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor

public class MarketPlaceController {

    private final MarketPlaceServices marketplaceServices;

    @GetMapping("/listings")
    public ResponseEntity<APIResponse> getAllAvailableListings() {
        return new ResponseEntity<>(new APIResponse(true, marketplaceServices.getAllAvailableListings()), HttpStatus.OK);
    }

    @GetMapping("/listings/type/{produceType}")
    public ResponseEntity<APIResponse> getListingsByType(@PathVariable String produceType) {
        return new ResponseEntity<>(new APIResponse(true, marketplaceServices.getListingsByType(produceType)), HttpStatus.OK);
    }

    @GetMapping("/listings/territory/{territory}")
    public ResponseEntity<APIResponse> getListingsByTerritory(@PathVariable String territory) {
        return new ResponseEntity<>(new APIResponse(true, marketplaceServices.getListingsByTerritory(territory)), HttpStatus.OK);
    }

    @GetMapping("/listings/price")
    public ResponseEntity<APIResponse> getListingsByPriceRange(@RequestParam Double minPrice, @RequestParam Double maxPrice) {
        return new ResponseEntity<>(new APIResponse(true, marketplaceServices.getListingsByPriceRange(minPrice, maxPrice)), HttpStatus.OK);
    }
}

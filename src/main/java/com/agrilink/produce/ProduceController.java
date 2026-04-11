package com.agrilink.produce;

import com.agrilink.produce.dto.ProduceRequest;
import com.agrilink.shared.APIResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produce")
@RequiredArgsConstructor
public class ProduceController {

    private final ProduceServices produceServices;

    @PostMapping("/agent/{agentId}/farmer/{farmerId}")
    public ResponseEntity<APIResponse> logProduceByAgent(@PathVariable String agentId, @PathVariable String farmerId, @Valid @RequestBody ProduceRequest request) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.logProduceByAgent(agentId, farmerId, request)), HttpStatus.CREATED);
    }

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> logProduceByFarmer(@PathVariable String farmerId, @Valid @RequestBody ProduceRequest request) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.logProduceByFarmer(farmerId, request)), HttpStatus.CREATED);
    }

    @GetMapping("/{produceId}")
    public ResponseEntity<APIResponse> getProduceById(@PathVariable String produceId) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getProduceById(produceId)), HttpStatus.OK);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> getProduceByFarmer(@PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getProduceByFarmer(farmerId)), HttpStatus.OK);
    }

    @GetMapping("/farmer/{farmerId}/available")
    public ResponseEntity<APIResponse> getAvailableProduceByFarmer(@PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getAvailableProduceByFarmer(farmerId)), HttpStatus.OK);
    }

    @GetMapping("/storage/{storageId}")
    public ResponseEntity<APIResponse> getProduceByStorage(@PathVariable String storageId) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getProduceByStorage(storageId)), HttpStatus.OK);
    }

    @GetMapping("/available")
    public ResponseEntity<APIResponse> getAvailableProduce() {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getAvailableProduce()), HttpStatus.OK);
    }

    @GetMapping("/type/{produceType}")
    public ResponseEntity<APIResponse> getProduceByType(@PathVariable String produceType) {
        return new ResponseEntity<>(new APIResponse(true, produceServices.getProduceByType(produceType)), HttpStatus.OK);
    }
}
package com.agrilink.withdrawal;


import com.agrilink.agent.services.AgentServices;
import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.FarmerServices;
import com.agrilink.produce.Produce;
import com.agrilink.produce.ProduceServices;
import com.agrilink.shared.events.ProduceWithdrawnEvent;
import com.agrilink.withdrawal.dto.WithdrawalRequest;
import com.agrilink.withdrawal.dto.WithdrawalResponse;
import com.agrilink.withdrawal.exceptions.WithdrawalNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WithdrawalServices {

    private final WithdrawalRepository withdrawalRepository;
    private final ProduceServices produceServices;
    private final FarmerServices farmerServices;
    private final AgentServices agentServices;
    private final ApplicationEventPublisher eventPublisher;

    public WithdrawalResponse processWithdrawal(WithdrawalRequest request) {
        agentServices.findById(request.getAgentId());
        Farmer farmer = farmerServices.findById(request.getFarmerId());
        Produce produce = produceServices.findById(request.getProduceId());

        double storageCost = produce.getAccruedStorageCost();

        produceServices.markAsWithdrawn(request.getProduceId());

        farmer.setStorageDebt(farmer.getStorageDebt() + storageCost);
        farmerServices.updateStorageDebt(request.getFarmerId(), farmer.getStorageDebt());

        WithdrawalEvent event = new WithdrawalEvent();
        event.setProduceId(request.getProduceId());
        event.setFarmerId(request.getFarmerId());
        event.setAgentId(request.getAgentId());
        event.setStorageCostAtWithdrawal(storageCost);
        event.setReason(request.getReason());

        WithdrawalEvent saved = withdrawalRepository.save(event);

        eventPublisher.publishEvent(new ProduceWithdrawnEvent(
                this, request.getProduceId(), request.getFarmerId()
        ));

        return mapToResponse(saved);
    }

    public WithdrawalResponse getWithdrawalById(String withdrawalId) {
        WithdrawalEvent event = withdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new WithdrawalNotFoundException(withdrawalId));
        return mapToResponse(event);
    }

    public List<WithdrawalResponse> getWithdrawalsByFarmer(String farmerId) {
        return withdrawalRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<WithdrawalResponse> getWithdrawalsByAgent(String agentId) {
        return withdrawalRepository.findByAgentId(agentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private WithdrawalResponse mapToResponse(WithdrawalEvent event) {
        return WithdrawalResponse.builder()
                .withdrawalId(event.getWithdrawalId())
                .produceId(event.getProduceId())
                .farmerId(event.getFarmerId())
                .agentId(event.getAgentId())
                .storageCostAtWithdrawal(event.getStorageCostAtWithdrawal())
                .reason(event.getReason())
                .withdrawnAt(event.getWithdrawnAt())
                .build();
    }
}
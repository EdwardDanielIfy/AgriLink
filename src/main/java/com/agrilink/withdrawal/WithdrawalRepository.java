package com.agrilink.withdrawal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawalRepository extends JpaRepository<WithdrawalEvent, String> {

    List<WithdrawalEvent> findByFarmerId(String farmerId);

    List<WithdrawalEvent> findByAgentId(String agentId);

    List<WithdrawalEvent> findByProduceId(String produceId);
}
package com.agrilink.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByFarmerId(String farmerId);

    List<Transaction> findByBuyerId(String buyerId);

    List<Transaction> findByAgentId(String agentId);

    List<Transaction> findByProduceId(String produceId);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByFarmerIdAndStatus(String farmerId, TransactionStatus status);

    List<Transaction> findByBuyerIdAndStatus(String buyerId, TransactionStatus status);

    List<Transaction> findByStatusAndOfferResponseDeadlineBefore(TransactionStatus status, LocalDateTime deadline);
}
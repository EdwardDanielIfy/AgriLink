package com.agrilink.produce;

import com.agrilink.shared.enums.ProduceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduceRepository extends JpaRepository<Produce, String> {

    List<Produce> findByFarmerId(String farmerId);

    List<Produce> findByStorageId(String storageId);

    List<Produce> findByAgentId(String agentId);

    List<Produce> findByStatus(ProduceStatus status);

    List<Produce> findByStatusIn(java.util.Collection<ProduceStatus> statuses);

    List<Produce> findByFarmerIdAndStatus(String farmerId, ProduceStatus status);

    List<Produce> findByStorageIdAndStatus(String storageId, ProduceStatus status);

    int countByStorageIdAndStatus(String storageId, ProduceStatus status);

    List<Produce> findByProduceType(String produceType);

    List<Produce> findByProduceTypeAndStatus(String produceType, ProduceStatus status);

    List<Produce> findByStatusAndReferencePriceBetween(ProduceStatus status, Double minPrice, Double maxPrice);
}
package com.agrilink.storage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StorageRepository extends JpaRepository<Storage, String> {

    List<Storage> findByTerritory(String territory);

    List<Storage> findByManagedByAgentId(String agentId);

    Optional<Storage> findByPartnerFacilityId(String partnerFacilityId);

    List<Storage> findByPartnerName(String partnerName);
}

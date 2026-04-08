package com.agrilink.farmer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, String> {
    Optional<Farmer> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);


    List<Farmer> findAllByRegisteredByAgentId(String registeredByAgentId);
}

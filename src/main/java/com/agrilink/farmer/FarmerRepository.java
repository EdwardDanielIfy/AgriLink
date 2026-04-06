package com.agrilink.farmer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, String> {
    Optional<Farmer> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);

//    @Query("SELECT a.agentId FROM Agent a WHERE a.territory = :location")
//    Optional<String> findAgentByTerritory(@Param("location") String location);
}

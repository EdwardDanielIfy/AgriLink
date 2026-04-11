package com.agrilink.buyer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {

    Optional<Buyer> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);
}
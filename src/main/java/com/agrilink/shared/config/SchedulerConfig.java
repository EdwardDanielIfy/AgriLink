package com.agrilink.shared.config;

import com.agrilink.produce.Produce;
import com.agrilink.produce.ProduceRepository;
import com.agrilink.shared.enums.ProduceStatus;
import com.agrilink.storage.Storage;
import com.agrilink.storage.StorageRepository;
import com.agrilink.transaction.TransactionServices;
import com.agrilink.farmer.FarmerServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SchedulerConfig {

    private final ProduceRepository produceRepository;
    private final StorageRepository storageRepository;
    private final FarmerServices farmerServices;
    private final TransactionServices transactionServices;

    @Scheduled(cron = "0 0 0 * * *")
    public void accrueStorageCosts() {
        log.info("Running storage cost accrual job at {}", LocalDateTime.now());

        List<Produce> activeProduce = produceRepository.findByStatus(ProduceStatus.AVAILABLE);
        activeProduce.addAll(produceRepository.findByStatus(ProduceStatus.OFFER_PENDING));

        for (Produce produce : activeProduce) {
            try {
                Storage storage = storageRepository.findById(produce.getStorageId())
                        .orElse(null);

                if (storage == null) {
                    log.warn("Storage not found for produce: {}", produce.getProduceId());
                    continue;
                }

                long daysInStorage = ChronoUnit.DAYS.between(
                        produce.getLastStorageCostUpdate(), LocalDateTime.now()
                );

                if (daysInStorage < 1) continue;

                double costToAdd = storage.getCostPerDay() * daysInStorage;
                double newAccruedCost = produce.getAccruedStorageCost() + costToAdd;

                produce.setAccruedStorageCost(newAccruedCost);
                produce.setLastStorageCostUpdate(LocalDateTime.now());
                produceRepository.save(produce);

                farmerServices.updateStorageDebt(
                        produce.getFarmerId(),
                        farmerServices.findById(produce.getFarmerId()).getStorageDebt() + costToAdd
                );

                log.info("Accrued NGN {} storage cost for produce: {}",
                        costToAdd, produce.getProduceId());

            } catch (Exception e) {
                log.error("Failed to accrue storage cost for produce: {}",
                        produce.getProduceId(), e);
            }
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    public void expireOverdueOffers() {
        log.info("Running offer expiry job at {}", LocalDateTime.now());
        try {
            transactionServices.expireOverdueTransactions();
        } catch (Exception e) {
            log.error("Failed to run offer expiry job", e);
        }
    }
}
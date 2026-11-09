package com.metermitra.api.repository;

import com.metermitra.api.model.Rickshaw;
import com.metermitra.api.model.RickshawStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RickshawRepository extends JpaRepository<Rickshaw, Long> {
    Optional<Rickshaw> findFirstByStatusOrderByBatteryPercentDesc(RickshawStatus status);
    long countByStatus(RickshawStatus status);
}


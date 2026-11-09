package com.metermitra.api.repository;

import com.metermitra.api.model.Driver;
import com.metermitra.api.model.DriverStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findFirstByStatusOrderByRatingDesc(DriverStatus status);
    long countByStatus(DriverStatus status);
}


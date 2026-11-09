package com.metermitra.api.repository;

import com.metermitra.api.model.Ride;
import com.metermitra.api.model.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RideRepository extends JpaRepository<Ride, Long> {
    long countByStatus(RideStatus status);
}


package com.metermitra.api.service;

import com.metermitra.api.dto.CreateRideRequest;
import com.metermitra.api.dto.RideResponse;
import com.metermitra.api.model.Driver;
import com.metermitra.api.model.DriverStatus;
import com.metermitra.api.model.Rickshaw;
import com.metermitra.api.model.RickshawStatus;
import com.metermitra.api.model.Ride;
import com.metermitra.api.model.RideStatus;
import com.metermitra.api.repository.DriverRepository;
import com.metermitra.api.repository.RickshawRepository;
import com.metermitra.api.repository.RideRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;
    private final RickshawRepository rickshawRepository;
    private final FareService fareService;

    public RideService(RideRepository rideRepository, DriverRepository driverRepository, RickshawRepository rickshawRepository, FareService fareService) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.rickshawRepository = rickshawRepository;
        this.fareService = fareService;
    }

    public List<RideResponse> findAll() {
        return rideRepository.findAll()
                .stream()
                .map(RideResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public RideResponse createRide(CreateRideRequest request) {
        Driver driver = driverRepository.findFirstByStatusOrderByRatingDesc(DriverStatus.AVAILABLE)
                .orElseThrow(() -> new IllegalStateException("No available driver found"));

        Rickshaw rickshaw = rickshawRepository.findFirstByStatusOrderByBatteryPercentDesc(RickshawStatus.AVAILABLE)
                .orElseThrow(() -> new IllegalStateException("No available rickshaw found"));

        Ride ride = new Ride();
        ride.setPassengerName(request.getPassengerName());
        ride.setPickupLocation(request.getPickupLocation());
        ride.setDropLocation(request.getDropLocation());
        ride.setDistanceKm(request.getDistanceKm());
        ride.setEstimatedFare(fareService.estimateFare(request.getDistanceKm(), false));
        ride.setRequestedAt(LocalDateTime.now());
        ride.setStatus(RideStatus.ASSIGNED);
        ride.setDriver(driver);
        ride.setRickshaw(rickshaw);

        driver.setStatus(DriverStatus.ON_RIDE);
        rickshaw.setStatus(RickshawStatus.ASSIGNED);

        return RideResponse.from(rideRepository.save(ride));
    }
}


package com.metermitra.api.service;

import com.metermitra.api.dto.DashboardResponse;
import com.metermitra.api.model.DriverStatus;
import com.metermitra.api.model.RickshawStatus;
import com.metermitra.api.model.RideStatus;
import com.metermitra.api.repository.DriverRepository;
import com.metermitra.api.repository.RickshawRepository;
import com.metermitra.api.repository.RideRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final DriverRepository driverRepository;
    private final RickshawRepository rickshawRepository;
    private final RideRepository rideRepository;
    private final FareService fareService;

    public DashboardService(DriverRepository driverRepository, RickshawRepository rickshawRepository, RideRepository rideRepository, FareService fareService) {
        this.driverRepository = driverRepository;
        this.rickshawRepository = rickshawRepository;
        this.rideRepository = rideRepository;
        this.fareService = fareService;
    }

    public DashboardResponse getDashboard() {
        long activeRides = rideRepository.countByStatus(RideStatus.ASSIGNED)
                + rideRepository.countByStatus(RideStatus.IN_PROGRESS);

        return new DashboardResponse(
                driverRepository.count(),
                driverRepository.countByStatus(DriverStatus.AVAILABLE),
                activeRides,
                rickshawRepository.countByStatus(RickshawStatus.AVAILABLE),
                fareService.estimateFare(5, false)
        );
    }
}


package com.metermitra.api;

import com.metermitra.api.model.Driver;
import com.metermitra.api.model.DriverStatus;
import com.metermitra.api.model.Rickshaw;
import com.metermitra.api.model.RickshawStatus;
import com.metermitra.api.repository.DriverRepository;
import com.metermitra.api.repository.RickshawRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DriverRepository driverRepository;
    private final RickshawRepository rickshawRepository;

    public DataSeeder(DriverRepository driverRepository, RickshawRepository rickshawRepository) {
        this.driverRepository = driverRepository;
        this.rickshawRepository = rickshawRepository;
    }

    @Override
    public void run(String... args) {
        driverRepository.save(new Driver("Aarav Sharma", "9876500011", 4.8, DriverStatus.AVAILABLE));
        driverRepository.save(new Driver("Meera Khan", "9876500012", 4.6, DriverStatus.AVAILABLE));
        driverRepository.save(new Driver("Rohan Iyer", "9876500013", 4.3, DriverStatus.OFFLINE));

        rickshawRepository.save(new Rickshaw("MH-12-EM-2041", "Koregaon Park", RickshawStatus.AVAILABLE, 92));
        rickshawRepository.save(new Rickshaw("MH-12-EM-7821", "Viman Nagar", RickshawStatus.AVAILABLE, 76));
        rickshawRepository.save(new Rickshaw("MH-12-EM-4410", "Kharadi", RickshawStatus.MAINTENANCE, 38));
    }
}


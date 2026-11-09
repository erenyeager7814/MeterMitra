package com.metermitra.api.controller;

import com.metermitra.api.model.Driver;
import com.metermitra.api.repository.DriverRepository;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:4200")
public class DriverController {

    private final DriverRepository driverRepository;

    public DriverController(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @GetMapping
    public List<Driver> findAll() {
        return driverRepository.findAll();
    }
}


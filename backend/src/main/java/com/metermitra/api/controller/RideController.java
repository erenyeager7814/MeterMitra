package com.metermitra.api.controller;

import com.metermitra.api.dto.CreateRideRequest;
import com.metermitra.api.dto.RideResponse;
import com.metermitra.api.service.RideService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(originPatterns = {"http://localhost:4200", "https://*.vercel.app"})
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping
    public List<RideResponse> findAll() {
        return rideService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RideResponse createRide(@Valid @RequestBody CreateRideRequest request) {
        return rideService.createRide(request);
    }
}


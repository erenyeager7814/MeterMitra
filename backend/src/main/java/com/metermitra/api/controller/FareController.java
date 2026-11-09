package com.metermitra.api.controller;

import com.metermitra.api.dto.FareEstimateRequest;
import com.metermitra.api.dto.FareEstimateResponse;
import com.metermitra.api.service.FareService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fares")
@CrossOrigin(origins = "http://localhost:4200")
public class FareController {

    private final FareService fareService;

    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/estimate")
    public FareEstimateResponse estimate(@Valid @RequestBody FareEstimateRequest request) {
        return new FareEstimateResponse(
                request.getDistanceKm(),
                fareService.estimateFare(request.getDistanceKm(), request.isPeakHour()),
                fareService.formula(request.isPeakHour())
        );
    }
}


package com.metermitra.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;

@Service
public class FareService {

    private static final BigDecimal BASE_FARE = BigDecimal.valueOf(30);
    private static final BigDecimal PER_KM_RATE = BigDecimal.valueOf(14);
    private static final BigDecimal PEAK_MULTIPLIER = BigDecimal.valueOf(1.20);

    public BigDecimal estimateFare(double distanceKm, boolean peakHour) {
        BigDecimal distanceCharge = PER_KM_RATE.multiply(BigDecimal.valueOf(distanceKm));
        BigDecimal fare = BASE_FARE.add(distanceCharge);

        if (peakHour) {
            fare = fare.multiply(PEAK_MULTIPLIER);
        }

        return fare.setScale(2, RoundingMode.HALF_UP);
    }

    public String formula(boolean peakHour) {
        String base = "30 base fare + 14 per km";
        return peakHour ? base + " + 20% peak hour multiplier" : base;
    }
}


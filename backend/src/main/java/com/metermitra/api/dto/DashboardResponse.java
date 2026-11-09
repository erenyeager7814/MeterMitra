package com.metermitra.api.dto;

import java.math.BigDecimal;

public class DashboardResponse {

    private long totalDrivers;
    private long availableDrivers;
    private long activeRides;
    private long availableRickshaws;
    private BigDecimal sampleFiveKmFare;

    public DashboardResponse(long totalDrivers, long availableDrivers, long activeRides, long availableRickshaws, BigDecimal sampleFiveKmFare) {
        this.totalDrivers = totalDrivers;
        this.availableDrivers = availableDrivers;
        this.activeRides = activeRides;
        this.availableRickshaws = availableRickshaws;
        this.sampleFiveKmFare = sampleFiveKmFare;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public long getAvailableDrivers() {
        return availableDrivers;
    }

    public long getActiveRides() {
        return activeRides;
    }

    public long getAvailableRickshaws() {
        return availableRickshaws;
    }

    public BigDecimal getSampleFiveKmFare() {
        return sampleFiveKmFare;
    }
}


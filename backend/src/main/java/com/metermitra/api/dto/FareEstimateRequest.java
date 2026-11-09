package com.metermitra.api.dto;

import javax.validation.constraints.DecimalMin;

public class FareEstimateRequest {

    @DecimalMin("0.1")
    private double distanceKm;

    private boolean peakHour;

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public boolean isPeakHour() {
        return peakHour;
    }

    public void setPeakHour(boolean peakHour) {
        this.peakHour = peakHour;
    }
}


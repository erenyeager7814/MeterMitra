package com.metermitra.api.dto;

import java.math.BigDecimal;

public class FareEstimateResponse {

    private double distanceKm;
    private BigDecimal fare;
    private String formula;

    public FareEstimateResponse(double distanceKm, BigDecimal fare, String formula) {
        this.distanceKm = distanceKm;
        this.fare = fare;
        this.formula = formula;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public String getFormula() {
        return formula;
    }
}


package com.metermitra.api.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;

public class CreateRideRequest {

    @NotBlank
    private String passengerName;

    @NotBlank
    private String pickupLocation;

    @NotBlank
    private String dropLocation;

    @DecimalMin("0.1")
    private double distanceKm;

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropLocation() {
        return dropLocation;
    }

    public void setDropLocation(String dropLocation) {
        this.dropLocation = dropLocation;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }
}


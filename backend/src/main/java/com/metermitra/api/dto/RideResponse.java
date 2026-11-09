package com.metermitra.api.dto;

import com.metermitra.api.model.Ride;
import com.metermitra.api.model.RideStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RideResponse {

    private Long id;
    private String passengerName;
    private String pickupLocation;
    private String dropLocation;
    private double distanceKm;
    private BigDecimal estimatedFare;
    private RideStatus status;
    private LocalDateTime requestedAt;
    private String driverName;
    private String rickshawRegistrationNumber;

    public static RideResponse from(Ride ride) {
        RideResponse response = new RideResponse();
        response.id = ride.getId();
        response.passengerName = ride.getPassengerName();
        response.pickupLocation = ride.getPickupLocation();
        response.dropLocation = ride.getDropLocation();
        response.distanceKm = ride.getDistanceKm();
        response.estimatedFare = ride.getEstimatedFare();
        response.status = ride.getStatus();
        response.requestedAt = ride.getRequestedAt();
        response.driverName = ride.getDriver() == null ? "Unassigned" : ride.getDriver().getName();
        response.rickshawRegistrationNumber = ride.getRickshaw() == null ? "Unassigned" : ride.getRickshaw().getRegistrationNumber();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public String getDropLocation() {
        return dropLocation;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public BigDecimal getEstimatedFare() {
        return estimatedFare;
    }

    public RideStatus getStatus() {
        return status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getRickshawRegistrationNumber() {
        return rickshawRegistrationNumber;
    }
}


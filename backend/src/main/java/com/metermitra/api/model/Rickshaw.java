package com.metermitra.api.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Entity
public class Rickshaw {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String area;

    @Enumerated(EnumType.STRING)
    private RickshawStatus status;

    private int batteryPercent;

    public Rickshaw() {
    }

    public Rickshaw(String registrationNumber, String area, RickshawStatus status, int batteryPercent) {
        this.registrationNumber = registrationNumber;
        this.area = area;
        this.status = status;
        this.batteryPercent = batteryPercent;
    }

    public Long getId() {
        return id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public RickshawStatus getStatus() {
        return status;
    }

    public void setStatus(RickshawStatus status) {
        this.status = status;
    }

    public int getBatteryPercent() {
        return batteryPercent;
    }

    public void setBatteryPercent(int batteryPercent) {
        this.batteryPercent = batteryPercent;
    }
}


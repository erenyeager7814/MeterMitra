package com.metermitra.api.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class FareServiceTest {

    private final FareService fareService = new FareService();

    @Test
    void estimatesRegularFare() {
        BigDecimal fare = fareService.estimateFare(5, false);

        assertThat(fare).isEqualByComparingTo("100.00");
    }

    @Test
    void appliesPeakHourMultiplier() {
        BigDecimal fare = fareService.estimateFare(5, true);

        assertThat(fare).isEqualByComparingTo("120.00");
    }
}


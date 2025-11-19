package com.laren.stock_analysis.controller;

import com.laren.stock_analysis.dto.ReturnsResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ReturnsController {

    // Simple annual compound interest: A = P * (1 + r)^t
    @GetMapping("/api/returns/calculate")
    public ReturnsResponse calculateReturns(
            @RequestParam double principal,
            @RequestParam double annualRate, // in percent, e.g. 12 for 12%
            @RequestParam int years
    ) {
        double rateDecimal = annualRate / 100.0;
        double futureValue = principal * Math.pow(1 + rateDecimal, years);
        return new ReturnsResponse(principal, annualRate, years, futureValue);
    }
}

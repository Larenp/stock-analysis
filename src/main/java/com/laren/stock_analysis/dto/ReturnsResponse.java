package com.laren.stock_analysis.dto;

public class ReturnsResponse {

    private double principal;
    private double annualRate;
    private int years;
    private double futureValue;
    private double totalGain;

    public ReturnsResponse(double principal, double annualRate, int years, double futureValue) {
        this.principal = principal;
        this.annualRate = annualRate;
        this.years = years;
        this.futureValue = futureValue;
        this.totalGain = futureValue - principal;
    }

    public double getPrincipal() {
        return principal;
    }

    public double getAnnualRate() {
        return annualRate;
    }

    public int getYears() {
        return years;
    }

    public double getFutureValue() {
        return futureValue;
    }

    public double getTotalGain() {
        return totalGain;
    }
}


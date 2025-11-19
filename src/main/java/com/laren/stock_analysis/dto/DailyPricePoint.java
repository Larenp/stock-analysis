package com.laren.stock_analysis.dto;

public class DailyPricePoint {

    private String date;
    private double close;

    public DailyPricePoint() {
    }

    public DailyPricePoint(String date, double close) {
        this.date = date;
        this.close = close;
    }

    public String getDate() {
        return date;
    }

    public double getClose() {
        return close;
    }
}

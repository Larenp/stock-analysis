package com.laren.stock_analysis.model;

public class Stock {

    private String symbol;
    private String name;
    private String sector;
    private double lastPrice;

    public Stock() {
    }

    public Stock(String symbol, String name, String sector, double lastPrice) {
        this.symbol = symbol;
        this.name = name;
        this.sector = sector;
        this.lastPrice = lastPrice;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public double getLastPrice() {
        return lastPrice;
    }

    public void setLastPrice(double lastPrice) {
        this.lastPrice = lastPrice;
    }
}

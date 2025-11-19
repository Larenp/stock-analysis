package com.laren.stock_analysis.dto;

public class StockSearchResult {

    private String symbol;
    private String name;
    private String region;
    private String currency;

    public StockSearchResult() {
    }

    public StockSearchResult(String symbol, String name, String region, String currency) {
        this.symbol = symbol;
        this.name = name;
        this.region = region;
        this.currency = currency;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public String getRegion() {
        return region;
    }

    public String getCurrency() {
        return currency;
    }
}

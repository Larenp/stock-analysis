package com.laren.stock_analysis.dto;

public class StockSearchResult {
    private String symbol;
    private String name;
    private String region;

    public StockSearchResult() {
    }

    public StockSearchResult(String symbol, String name, String region) {
        this.symbol = symbol;
        this.name = name;
        this.region = region;
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
}

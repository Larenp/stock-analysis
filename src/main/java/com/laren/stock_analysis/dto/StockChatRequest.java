package com.laren.stock_analysis.dto;

public class StockChatRequest {
    private String symbol;
    private String question;

    public StockChatRequest() {
    }

    public String getSymbol() {
        return symbol;
    }

    public String getQuestion() {
        return question;
    }
}

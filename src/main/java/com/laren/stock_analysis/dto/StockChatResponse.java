package com.laren.stock_analysis.dto;

public class StockChatResponse {
    private String answer;

    public StockChatResponse() {
    }

    public StockChatResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }
}

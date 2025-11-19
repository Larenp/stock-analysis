package com.laren.stock_analysis.controller;

import com.laren.stock_analysis.dto.StockChatRequest;
import com.laren.stock_analysis.dto.StockChatResponse;
import com.laren.stock_analysis.service.StockChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class StockChatController {

    private final StockChatService stockChatService;

    public StockChatController(StockChatService stockChatService) {
        this.stockChatService = stockChatService;
    }

    @PostMapping("/stock")
    public StockChatResponse chat(@RequestBody StockChatRequest request) {
        return stockChatService.chat(request);
    }
}

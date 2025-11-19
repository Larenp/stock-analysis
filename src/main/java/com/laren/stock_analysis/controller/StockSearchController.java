package com.laren.stock_analysis.controller;

import com.laren.stock_analysis.dto.StockSearchResult;
import com.laren.stock_analysis.service.AlphaVantageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:3000")
public class StockSearchController {

    private final AlphaVantageService alphaVantageService;

    public StockSearchController(AlphaVantageService alphaVantageService) {
        this.alphaVantageService = alphaVantageService;
    }

    @GetMapping("/search")
    public List<StockSearchResult> search(@RequestParam String query) {
        return alphaVantageService.searchStocks(query);
    }
}

package com.laren.stock_analysis.controller;

import com.laren.stock_analysis.dto.DailyPricePoint;
import com.laren.stock_analysis.service.AlphaVantageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:3000")
public class StockChartController {

    private final AlphaVantageService alphaVantageService;

    public StockChartController(AlphaVantageService alphaVantageService) {
        this.alphaVantageService = alphaVantageService;
    }

    @GetMapping("/{symbol}/daily")
    public List<DailyPricePoint> getDaily(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "60") int limit
    ) {
        return alphaVantageService.getDailySeries(symbol, limit);
    }
}

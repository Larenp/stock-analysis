package com.laren.stock_analysis.controller;

import com.laren.stock_analysis.model.Stock;
import com.laren.stock_analysis.service.WatchlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public List<Stock> getAll() {
        return watchlistService.getAll();
    }

    @PostMapping
    public Stock addStock(@RequestBody Stock stock) {
        return watchlistService.addOrUpdate(stock);
    }

    @DeleteMapping("/{symbol}")
    public void remove(@PathVariable String symbol) {
        watchlistService.remove(symbol);
    }
}

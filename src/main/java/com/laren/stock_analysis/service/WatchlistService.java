package com.laren.stock_analysis.service;

import com.laren.stock_analysis.model.Stock;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WatchlistService {

    private final Map<String, Stock> watchlist = new LinkedHashMap<>();
    private final AlphaVantageService alphaVantageService;

    public WatchlistService(AlphaVantageService alphaVantageService) {
        this.alphaVantageService = alphaVantageService;

        // Optional sample data
        addOrUpdate(new Stock("TCS", "Tata Consultancy Services", "IT Services", 3900.0));
        addOrUpdate(new Stock("INFY", "Infosys", "IT Services", 1500.0));
        addOrUpdate(new Stock("RELIANCE", "Reliance Industries", "Conglomerate", 2800.0));
    }

    public List<Stock> getAll() {
        return new ArrayList<>(watchlist.values());
    }

    public Stock addOrUpdate(Stock stock) {
        stock.setSymbol(stock.getSymbol().toUpperCase());
        watchlist.put(stock.getSymbol(), stock);
        return stock;
    }

    public void remove(String symbol) {
        watchlist.remove(symbol.toUpperCase());
    }

    public List<Stock> refreshPrices() {
        for (Stock stock : watchlist.values()) {
            Double latest = alphaVantageService.getLatestPrice(stock.getSymbol());
            if (latest != null) {
                stock.setLastPrice(latest);
            }
        }
        return getAll();
    }
}

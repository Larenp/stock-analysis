package com.laren.stock_analysis.service;

import com.laren.stock_analysis.model.Stock;   // <-- this import is critical
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
        addOrUpdate(new Stock("TCS", "Tata Consultancy Services", "IT Services", 0.0));
        addOrUpdate(new Stock("INFY", "Infosys", "IT Services", 0.0));
        addOrUpdate(new Stock("RELIANCE", "Reliance Industries", "Conglomerate", 0.0));
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
        System.out.println("Latest price for " + stock.getSymbol() + " = " + latest);
        if (latest != null && latest > 1.0) { // ignore junk values below 1
            stock.setLastPrice(latest);
        }
    }
    return getAll();
}

}

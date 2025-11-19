package com.laren.stock_analysis.service;

import com.laren.stock_analysis.dto.StockSearchResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.laren.stock_analysis.dto.DailyPricePoint;
import java.util.TreeMap;
import java.math.BigDecimal;



import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AlphaVantageService {

    @Value("${alphavantage.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<StockSearchResult> searchStocks(String keywords) {
        try {
            String encoded = URLEncoder.encode(keywords, StandardCharsets.UTF_8);
            String url = "https://www.alphavantage.co/query"
                    + "?function=SYMBOL_SEARCH"
                    + "&keywords=" + encoded
                    + "&apikey=" + apiKey;

            @SuppressWarnings("unchecked")
            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response == null) {
                return new ArrayList<>();
            }

            @SuppressWarnings("unchecked")
            List<Map<String, String>> bestMatches =
                    (List<Map<String, String>>) response.get("bestMatches");

            List<StockSearchResult> results = new ArrayList<>();
            if (bestMatches == null) {
                return results;
            }

            for (Map<String, String> item : bestMatches) {
                String symbol = item.get("1. symbol");
                String name = item.get("2. name");
                String region = item.get("4. region");
                String currency = item.get("8. currency");
                results.add(new StockSearchResult(symbol, name, region, currency));
            }

            return results;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    public List<DailyPricePoint> getDailySeries(String symbol, int maxPoints) {
    try {
        String encodedSymbol = URLEncoder.encode(symbol, StandardCharsets.UTF_8);
        String url = "https://www.alphavantage.co/query"
                + "?function=TIME_SERIES_DAILY"
                + "&symbol=" + encodedSymbol
                + "&apikey=" + apiKey;

        @SuppressWarnings("unchecked")
        Map<String, Object> response =
                restTemplate.getForObject(url, Map.class);

        if (response == null) {
            return new ArrayList<>();
        }

        Object seriesObj = response.get("Time Series (Daily)");
        if (!(seriesObj instanceof Map)) {
            // Could be rate limit or error message; just return empty for now
            return new ArrayList<>();
        }

        @SuppressWarnings("unchecked")
        Map<String, Map<String, String>> series =
                (Map<String, Map<String, String>>) seriesObj;

        // Sort dates ascending
        TreeMap<String, Map<String, String>> sorted =
                new TreeMap<>(series);

        List<DailyPricePoint> points = new ArrayList<>();

        for (Map.Entry<String, Map<String, String>> entry : sorted.entrySet()) {
            String date = entry.getKey();
            Map<String, String> values = entry.getValue();
            String closeStr = values.get("4. close");
            if (closeStr == null) {
                continue;
            }
            double close = Double.parseDouble(closeStr);
            points.add(new DailyPricePoint(date, close));
        }

        // If maxPoints > 0, only keep the most recent N points
        if (maxPoints > 0 && points.size() > maxPoints) {
            return points.subList(points.size() - maxPoints, points.size());
        }

        return points;
    } catch (Exception e) {
        e.printStackTrace();
        return new ArrayList<>();
    }
    
}
public Double getLatestPrice(String symbol) {
    try {
        String encodedSymbol = URLEncoder.encode(symbol, StandardCharsets.UTF_8);
        String url = "https://www.alphavantage.co/query"
                + "?function=GLOBAL_QUOTE"
                + "&symbol=" + encodedSymbol
                + "&apikey=" + apiKey;

        @SuppressWarnings("unchecked")
        Map<String, Object> response =
                restTemplate.getForObject(url, Map.class);

        if (response == null) {
            return null;
        }

        Object quoteObj = response.get("Global Quote");
        if (!(quoteObj instanceof Map)) {
            return null;
        }

        @SuppressWarnings("unchecked")
        Map<String, String> quote = (Map<String, String>) quoteObj;

        String priceStr = quote.get("05. price");
        if (priceStr == null) {
            return null;
        }

        return new BigDecimal(priceStr).doubleValue();
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}


}

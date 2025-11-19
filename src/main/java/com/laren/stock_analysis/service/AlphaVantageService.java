// src/main/java/com/laren/stock_analysis/service/AlphaVantageService.java
package com.laren.stock_analysis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laren.stock_analysis.dto.DailyPricePoint;
import com.laren.stock_analysis.dto.StockSearchResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class AlphaVantageService {

    @Value("${alphavantage.api.key}")
    private String alphaKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // === 1. Symbol search (used by StockSearchController) ===
    public List<StockSearchResult> searchStocks(String query) {
        try {
            String url =
                    "https://www.alphavantage.co/query" +
                    "?function=SYMBOL_SEARCH" +
                    "&keywords=" + query +
                    "&apikey=" + alphaKey;

            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(json);
            JsonNode matches = root.path("bestMatches");

            if (!matches.isArray()) {
                return Collections.emptyList();
            }

            List<StockSearchResult> results = new ArrayList<>();
            for (JsonNode m : matches) {
                String symbol = m.path("1. symbol").asText();
                String name = m.path("2. name").asText();
                String region = m.path("4. region").asText();
                results.add(new StockSearchResult(symbol, name, region));
            }
            return results;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // === 2. Latest price (used by WatchlistService) ===
    public Double getLatestPrice(String symbol) {
        try {
            String url =
                    "https://www.alphavantage.co/query" +
                    "?function=GLOBAL_QUOTE" +
                    "&symbol=" + symbol +
                    "&apikey=" + alphaKey;

            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(json);
            JsonNode quote = root.path("Global Quote");
            if (quote.isMissingNode()) {
                return null;
            }
            if (!quote.has("05. price")) {
                return null;
            }
            return quote.path("05. price").asDouble();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // === 3. Daily series (used by /api/stocks/{symbol}/daily) ===
    public List<DailyPricePoint> getDailySeries(String symbol, int limit) {
        try {
            String url =
                    "https://www.alphavantage.co/query" +
                    "?function=TIME_SERIES_DAILY" +
                    "&symbol=" + symbol +
                    "&outputsize=compact" +
                    "&apikey=" + alphaKey;

            String json = restTemplate.getForObject(url, String.class);

            // debug logs
            System.out.println("Raw Alpha response for " + symbol + ": " + json);

            JsonNode root = objectMapper.readTree(json);

            if (root.has("Error Message") || root.has("Note")) {
                System.out.println("AlphaVantage error/note for " + symbol + ": " + root);
                return Collections.emptyList();
            }

            JsonNode series = root.path("Time Series (Daily)");
            System.out.println("Parsed series node for " + symbol + ": " + series);

            if (series.isMissingNode() || !series.fields().hasNext()) {
                return Collections.emptyList();
            }

            List<DailyPricePoint> list = new ArrayList<>();
            Iterator<String> dates = series.fieldNames();

            while (dates.hasNext()) {
                String d = dates.next();
                JsonNode entry = series.get(d);
                double close = entry.path("4. close").asDouble();
                list.add(new DailyPricePoint(d, close));
            }

            list.sort(Comparator.comparing(p -> LocalDate.parse(p.getDate())));

            if (list.size() > limit) {
                return list.subList(list.size() - limit, list.size());
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}

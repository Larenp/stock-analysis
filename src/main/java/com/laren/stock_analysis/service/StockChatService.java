package com.laren.stock_analysis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laren.stock_analysis.dto.StockChatRequest;
import com.laren.stock_analysis.dto.StockChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class StockChatService {

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StockChatResponse chat(StockChatRequest req) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            return new StockChatResponse(
                    "AI analysis is not available because the OpenAI API key is not configured."
            );
        }

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");

            List<Map<String, String>> messages = new ArrayList<>();

            messages.add(Map.of(
                    "role", "system",
                    "content",
                    "You are an educational stock analysis assistant. " +
                    "You NEVER give personal investment advice or say to buy/sell. " +
                    "You do not give exact return percentages. Explain risks, time horizons, and what to research."
            ));

            String userPrompt =
                    "Stock symbol: " + req.getSymbol() + ".\n" +
                    "User question: " + req.getQuestion() + ".\n" +
                    "Reply in short clear paragraphs.";

            messages.add(Map.of(
                    "role", "user",
                    "content", userPrompt
            ));

            body.put("messages", messages);
            body.put("temperature", 0.4);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return new StockChatResponse(
                        "AI analysis is temporarily unavailable. Please try again later."
                );
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return new StockChatResponse(
                        "AI did not return any message. Please try a different question."
                );
            }

            String answer = choices.get(0)
                    .path("message")
                    .path("content")
                    .asText("");

            if (answer == null || answer.isBlank()) {
                answer = "AI did not return a readable answer. Please try again.";
            }

            return new StockChatResponse(answer.trim());
        } catch (Exception e) {
            e.printStackTrace();
            return new StockChatResponse(
                    "There was an error talking to the AI service. Please try again later."
            );
        }
    }
}

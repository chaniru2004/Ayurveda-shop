package com.ayurveda.shop.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoshaQuizResult {
    private String dominantDosha;
    private String title;
    private String description;
    private List<Product> recommendedProducts;
}

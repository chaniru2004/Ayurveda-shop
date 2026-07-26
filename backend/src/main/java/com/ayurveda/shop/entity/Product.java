package com.ayurveda.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String ailment;

    @Column(nullable = false)
    private String dosha; // vata, pitta, kapha, tridosha

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private BigDecimal originalPrice;

    private Double rating;

    private Integer reviewsCount;

    private String badge;

    private String badgeType;

    private String image;

    @Column(length = 1000)
    private String ingredients;

    @Column(length = 1000)
    private String benefits;

    private String dosage;
}

package com.ayurveda.shop.config;

import com.ayurveda.shop.entity.Product;
import com.ayurveda.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("Organic Ashwagandha Powder")
                    .category("Herbal Powders")
                    .ailment("stress")
                    .dosha("vata")
                    .price(new BigDecimal("24.99"))
                    .originalPrice(new BigDecimal("29.99"))
                    .rating(4.9)
                    .reviewsCount(128)
                    .badge("Best Seller")
                    .badgeType("badge-gold")
                    .image("assets/ashwagandha.png")
                    .ingredients("100% Pure Organic Withania Somnifera Root Extract")
                    .benefits("Reduces stress & cortisol, improves stamina and sleep quality.")
                    .dosage("1 tsp daily with warm milk or water")
                    .stock(45)
                    .build());

            productRepository.save(Product.builder()
                    .name("Triphala Churna Organic Blend")
                    .category("Gut Health & Cleansing")
                    .ailment("digestion")
                    .dosha("tridosha")
                    .price(new BigDecimal("18.50"))
                    .originalPrice(new BigDecimal("22.00"))
                    .rating(4.8)
                    .reviewsCount(94)
                    .badge("Organic")
                    .badgeType("badge-organic")
                    .image("assets/triphala.png")
                    .ingredients("Amalaki, Bibhitaki, Haritaki organic fruit powders")
                    .benefits("Supports healthy digestion, colon cleansing, and natural detox.")
                    .dosage("1/2 tsp before bedtime with warm water")
                    .stock(50)
                    .build());

            productRepository.save(Product.builder()
                    .name("Organic Tulsi Holy Basil Tea")
                    .category("Herbal Teas")
                    .ailment("immunity")
                    .dosha("kapha")
                    .price(new BigDecimal("14.99"))
                    .originalPrice(new BigDecimal("17.99"))
                    .rating(4.9)
                    .reviewsCount(76)
                    .badge("Immunity Boost")
                    .badgeType("badge-dosha")
                    .image("assets/tulsi_tea.png")
                    .ingredients("Rama Tulsi, Krishna Tulsi, Vana Tulsi organic leaves")
                    .benefits("Enhances natural immunity, calms mind, supports respiratory health.")
                    .dosage("Steep 1 tea bag for 5-7 minutes in hot water")
                    .stock(60)
                    .build());

            productRepository.save(Product.builder()
                    .name("Mahanarayan Joint Care Massage Oil")
                    .category("Ayurvedic Oils")
                    .ailment("joints")
                    .dosha("pitta")
                    .price(new BigDecimal("29.99"))
                    .originalPrice(new BigDecimal("34.99"))
                    .rating(4.7)
                    .reviewsCount(53)
                    .badge("Pain Relief")
                    .badgeType("badge-gold")
                    .image("assets/hero.png")
                    .ingredients("Sesame oil infused with 30+ revitalizing Ayurvedic herbs")
                    .benefits("Relieves joint stiffness, calms Vata, promotes deep muscle relaxation.")
                    .dosage("Gently massage warm oil onto affected joints for 10-15 mins")
                    .stock(25)
                    .build());
        }
    }
}

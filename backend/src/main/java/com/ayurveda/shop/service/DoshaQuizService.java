package com.ayurveda.shop.service;

import com.ayurveda.shop.entity.DoshaQuizResult;
import com.ayurveda.shop.entity.Product;
import com.ayurveda.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoshaQuizService {

    private final ProductRepository productRepository;

    public DoshaQuizResult calculatePrakriti(String q1, String q2, String q3) {
        int vataScore = 0;
        int pittaScore = 0;
        int kaphaScore = 0;

        if ("vata".equalsIgnoreCase(q1)) vataScore++;
        else if ("pitta".equalsIgnoreCase(q1)) pittaScore++;
        else if ("kapha".equalsIgnoreCase(q1)) kaphaScore++;

        if ("vata".equalsIgnoreCase(q2)) vataScore++;
        else if ("pitta".equalsIgnoreCase(q2)) pittaScore++;
        else if ("kapha".equalsIgnoreCase(q2)) kaphaScore++;

        if ("vata".equalsIgnoreCase(q3)) vataScore++;
        else if ("pitta".equalsIgnoreCase(q3)) pittaScore++;
        else if ("kapha".equalsIgnoreCase(q3)) kaphaScore++;

        String dominantDosha = "vata";
        if (pittaScore >= vataScore && pittaScore >= kaphaScore) dominantDosha = "pitta";
        if (kaphaScore >= vataScore && kaphaScore >= pittaScore) dominantDosha = "kapha";

        List<Product> recommendedProducts = productRepository.findByDoshaContainingIgnoreCase(dominantDosha);

        switch (dominantDosha) {
            case "pitta":
                return DoshaQuizResult.builder()
                        .dominantDosha("pitta")
                        .title("Pitta Prakriti (Fire & Water)")
                        .description("Your constitution is driven by strong focus, high metabolism, and warmth. Balance your inner fire with cooling, soothing herbs like Shatavari and Saffron oil.")
                        .recommendedProducts(recommendedProducts)
                        .build();
            case "kapha":
                return DoshaQuizResult.builder()
                        .dominantDosha("kapha")
                        .title("Kapha Prakriti (Earth & Water)")
                        .description("Your constitution is grounded, strong, patient, and calm. Invigorate your body with stimulating spices, digestive teas, and warm Tulsi blends.")
                        .recommendedProducts(recommendedProducts)
                        .build();
            default:
                return DoshaQuizResult.builder()
                        .dominantDosha("vata")
                        .title("Vata Prakriti (Air & Ether)")
                        .description("Your constitution is characterized by quick movement, creativity, and alertness. Balance yourself with warming, grounding herbs like Ashwagandha.")
                        .recommendedProducts(recommendedProducts)
                        .build();
        }
    }
}

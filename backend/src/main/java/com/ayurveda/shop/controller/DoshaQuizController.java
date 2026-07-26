package com.ayurveda.shop.controller;

import com.ayurveda.shop.entity.DoshaQuizResult;
import com.ayurveda.shop.service.DoshaQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DoshaQuizController {

    private final DoshaQuizService doshaQuizService;

    @GetMapping("/calculate")
    public ResponseEntity<DoshaQuizResult> calculateDosha(
            @RequestParam String q1,
            @RequestParam String q2,
            @RequestParam String q3) {
        return ResponseEntity.ok(doshaQuizService.calculatePrakriti(q1, q2, q3));
    }
}

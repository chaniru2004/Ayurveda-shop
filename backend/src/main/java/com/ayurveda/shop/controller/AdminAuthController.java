package com.ayurveda.shop.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private boolean authenticated;
        private String token;
        private String username;
        private String message;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request != null 
                && "thissa".equalsIgnoreCase(request.getUsername()) 
                && "admin123".equals(request.getPassword())) {
            
            LoginResponse response = LoginResponse.builder()
                    .authenticated(true)
                    .token("AUTH-THISSA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .username("thissa")
                    .message("Welcome back, Thissa! Login successful.")
                    .build();
            
            return ResponseEntity.ok(response);
        }

        LoginResponse failureResponse = LoginResponse.builder()
                .authenticated(false)
                .message("Invalid username or password. Please try again.")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(failureResponse);
    }
}

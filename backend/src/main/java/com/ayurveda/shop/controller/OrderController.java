package com.ayurveda.shop.controller;

import com.ayurveda.shop.entity.Order;
import com.ayurveda.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<Order> getOrder(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(orderService.getOrderByTrackingNumber(trackingNumber));
    }
}

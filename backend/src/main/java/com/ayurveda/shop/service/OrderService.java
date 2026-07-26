package com.ayurveda.shop.service;

import com.ayurveda.shop.entity.Order;
import com.ayurveda.shop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public Order createOrder(Order order) {
        order.setOrderTrackingNumber("AV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return orderRepository.save(order);
    }

    public Order getOrderByTrackingNumber(String trackingNumber) {
        return orderRepository.findByOrderTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with tracking number: " + trackingNumber));
    }
}

package com.ayurveda.shop.controller;

import com.ayurveda.shop.entity.Order;
import com.ayurveda.shop.entity.Product;
import com.ayurveda.shop.repository.OrderRepository;
import com.ayurveda.shop.repository.ProductRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminStatsController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Data
    @Builder
    public static class AdminDashboardStats {
        private long totalProducts;
        private long totalOrders;
        private BigDecimal totalRevenue;
        private long pendingOrdersCount;
        private long lowStockProductsCount;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardStats> getStats() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        BigDecimal revenue = orders.stream()
                .filter(o -> o.getTotalAmount() != null)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() != null && "PENDING".equalsIgnoreCase(o.getStatus()))
                .count();

        long lowStock = products.stream()
                .filter(p -> p.getStock() != null && p.getStock() <= 10)
                .count();

        AdminDashboardStats stats = AdminDashboardStats.builder()
                .totalProducts(products.size())
                .totalOrders(orders.size())
                .totalRevenue(revenue)
                .pendingOrdersCount(pendingOrders)
                .lowStockProductsCount(lowStock)
                .build();

        return ResponseEntity.ok(stats);
    }
}

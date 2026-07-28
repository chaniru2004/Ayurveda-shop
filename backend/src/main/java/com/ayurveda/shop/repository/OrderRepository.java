package com.ayurveda.shop.repository;

import com.ayurveda.shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderTrackingNumber(String trackingNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
}

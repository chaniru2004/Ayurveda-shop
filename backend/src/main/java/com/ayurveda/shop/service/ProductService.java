package com.ayurveda.shop.service;

import com.ayurveda.shop.entity.Product;
import com.ayurveda.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByAilment(String ailment) {
        if ("all".equalsIgnoreCase(ailment)) {
            return productRepository.findAll();
        }
        return productRepository.findByAilment(ailment);
    }

    public List<Product> getProductsByDosha(String dosha) {
        if ("all".equalsIgnoreCase(dosha)) {
            return productRepository.findAll();
        }
        return productRepository.findByDoshaContainingIgnoreCase(dosha);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}

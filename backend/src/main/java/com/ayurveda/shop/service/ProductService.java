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
        if (product.getStock() == null) {
            product.setStock(50);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product details) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(details.getName());
        product.setCategory(details.getCategory());
        product.setAilment(details.getAilment());
        product.setDosha(details.getDosha());
        product.setPrice(details.getPrice());
        if (details.getOriginalPrice() != null) product.setOriginalPrice(details.getOriginalPrice());
        if (details.getRating() != null) product.setRating(details.getRating());
        if (details.getReviewsCount() != null) product.setReviewsCount(details.getReviewsCount());
        if (details.getBadge() != null) product.setBadge(details.getBadge());
        if (details.getBadgeType() != null) product.setBadgeType(details.getBadgeType());
        if (details.getImage() != null) product.setImage(details.getImage());
        if (details.getIngredients() != null) product.setIngredients(details.getIngredients());
        if (details.getBenefits() != null) product.setBenefits(details.getBenefits());
        if (details.getDosage() != null) product.setDosage(details.getDosage());
        if (details.getStock() != null) product.setStock(details.getStock());

        return productRepository.save(product);
    }

    public Product updateStock(Long id, Integer stock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setStock(stock);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}

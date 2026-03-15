package com.example.backend.service;

import com.example.backend.entities.Product;
import com.example.backend.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public Product create(Product product) {
        return productRepository.save(product);
    }

}

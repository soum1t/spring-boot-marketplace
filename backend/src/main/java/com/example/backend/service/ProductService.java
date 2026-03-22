package com.example.backend.service;

import com.example.backend.dtos.request.CreateProductRequest;
import com.example.backend.dtos.response.CreateProductResponse;
import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public CreateProductResponse create(CreateProductRequest createProductRequest, String email) {
        User user = userService.findByEmail(email);

        Product product = Product.builder()
                .name(createProductRequest.getName())
                .description(createProductRequest.getDescription())
                .price(createProductRequest.getPrice())
                .user(user)
                .build();

        productRepository.save(product);

        return CreateProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .message("Product created successfully.")
                .build();
    }

    public Set<Product> getProducts(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        return byEmail.map(User::getProducts).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Product getProductById(Long id, String email) {
        return  productRepository.findByIdAndUser(id, userService.findByEmail(email)).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}

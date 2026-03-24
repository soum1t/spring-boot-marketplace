package com.example.backend.service;

import com.example.backend.dtos.request.CreateProductRequest;
import com.example.backend.dtos.response.CreateProductResponse;
import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.FileUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final FileUtils fileUtils;
    private final S3Service s3Service;

    @Transactional
    public CreateProductResponse create(CreateProductRequest createProductRequest, MultipartFile file, String email) {

        try {
            fileUtils.validateImage(file);
        }  catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        User user = userService.findByEmail(email);

        String imgKey = null;

        try {
            imgKey = s3Service.uploadFile(file, "products");
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image");
        }

        Product product = Product.builder()
                .name(createProductRequest.getName())
                .description(createProductRequest.getDescription())
                .price(createProductRequest.getPrice())
                .imgKey(imgKey)
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

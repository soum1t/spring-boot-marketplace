package com.example.backend.controllers;

import com.example.backend.dtos.request.CreateProductRequest;
import com.example.backend.dtos.response.CreateProductResponse;
import com.example.backend.entities.Product;
import com.example.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateProductResponse> create(
            @RequestPart("data") @Valid CreateProductRequest req,
            @RequestPart("file") MultipartFile file
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.create(req, file, authentication.getName()));
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getProduct(@PathVariable @Valid Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        return ResponseEntity.ok(productService.getProductById(id, authentication.getName()));
    }

    @GetMapping("all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getProducts());
    }

}

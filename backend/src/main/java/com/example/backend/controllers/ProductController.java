package com.example.backend.controllers;

import com.example.backend.dtos.request.CreateProductRequest;
import com.example.backend.dtos.response.CreateProductResponse;
import com.example.backend.entities.Product;
import com.example.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("create")
    public ResponseEntity<CreateProductResponse> create(@RequestBody @Valid CreateProductRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.create(req, authentication.getName()));
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getProduct(@PathVariable @Valid Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        return ResponseEntity.ok(productService.getProductById(id, authentication.getName()));
    }

    @GetMapping("all")
    public ResponseEntity<Set<Product>> getAllProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.getProducts(authentication.getName()));
    }

}

package com.example.backend.repositories;

import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByIdAndUser(Long id, User user);
}

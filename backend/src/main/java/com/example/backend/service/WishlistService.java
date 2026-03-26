package com.example.backend.service;

import com.example.backend.dtos.response.WishlistResponse;
import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import com.example.backend.entities.Wishlist;
import com.example.backend.entities.WishlistId;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;

    public WishlistResponse add(String email, Long productId) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if  (byEmail.isEmpty()) throw new RuntimeException("User not found");
        Optional<Product> byId = productRepository.findById(productId);
        if (byId.isEmpty()) throw new RuntimeException("Product not found");
        Wishlist wishlist = new Wishlist();
        WishlistId id = new WishlistId();
        id.setUserId(byEmail.get().getId());
        id.setProductId(productId);
        wishlist.setId(id);
        wishlistRepository.save(wishlist);
        return new WishlistResponse("Product added to wishlist successfully.");
    }

    public WishlistResponse remove(String email, Long productId) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if  (byEmail.isEmpty()) throw new RuntimeException("User not found");
        Wishlist wishlist = new Wishlist();
        WishlistId id = new WishlistId();
        id.setUserId(byEmail.get().getId());
        id.setProductId(productId);
        wishlist.setId(id);
        wishlistRepository.delete(wishlist);
        return new WishlistResponse("Product removed from wishlist successfully.");
    }
}

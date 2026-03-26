package com.example.backend.controllers;

import com.example.backend.dtos.response.WishlistResponse;
import com.example.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/add/{productId}")
    public ResponseEntity<WishlistResponse> addWishlist(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(wishlistService.add(authentication.getName(), productId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<WishlistResponse> removeWishlist(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(wishlistService.remove(authentication.getName(), productId));
    }

}

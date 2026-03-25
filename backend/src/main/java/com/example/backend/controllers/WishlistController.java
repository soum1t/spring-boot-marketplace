package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("wishlist")
public class WishlistController {

    @GetMapping("add/{productId}")
    public ResponseEntity addWishlist(@PathVariable String productId) {
        // TODO: add to wishlist
        return null;
    }

    @DeleteMapping("remove/{productId}")
    public ResponseEntity removeWishlist(@PathVariable String productId) {
        // TODO: remove from wishlist
        return null;
    }

}

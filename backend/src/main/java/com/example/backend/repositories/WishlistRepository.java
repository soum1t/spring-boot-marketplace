package com.example.backend.repositories;

import com.example.backend.entities.Wishlist;
import com.example.backend.entities.WishlistId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, WishlistId> {
}

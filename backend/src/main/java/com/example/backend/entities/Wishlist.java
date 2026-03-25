package com.example.backend.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Wishlist {

    @EmbeddedId
    private WishlistId id;

}

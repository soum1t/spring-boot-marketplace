package com.example.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class WishlistId implements Serializable {

    private Long userId;
    private Long productId;

}

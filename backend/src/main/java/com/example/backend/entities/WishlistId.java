package com.example.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class WishlistId implements Serializable {

    private String userId;
    private String productId;

}

package com.example.backend.dtos.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateProductResponse {
    Long id;
    String name;
    String message;
}

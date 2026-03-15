package com.example.backend.dtos.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterUserResponse {
    private String name;
    private String email;
    private String message;
}

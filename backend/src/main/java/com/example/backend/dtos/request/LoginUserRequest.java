package com.example.backend.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginUserRequest {

    @NotBlank
    @Email
    @Size(max = 50)
    private String email;

    @NotBlank
    @Size(min = 6, max = 24)
    private String password;

}

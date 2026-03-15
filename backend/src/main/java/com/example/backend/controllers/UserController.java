package com.example.backend.controllers;

import com.example.backend.dtos.request.LoginUserRequest;
import com.example.backend.dtos.request.RegisterUserRequest;
import com.example.backend.dtos.response.LoginUserResponse;
import com.example.backend.dtos.response.RegisterUserResponse;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("register")
    public ResponseEntity<RegisterUserResponse> registerUser(@RequestBody @Valid RegisterUserRequest user) throws Exception {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("login")
    public ResponseEntity<LoginUserResponse> loginUser(@RequestBody @Valid LoginUserRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

}

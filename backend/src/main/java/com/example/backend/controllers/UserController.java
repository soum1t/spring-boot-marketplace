package com.example.backend.controllers;

import com.example.backend.dtos.request.LoginUserRequest;
import com.example.backend.dtos.request.RegisterUserRequest;
import com.example.backend.dtos.response.LoginUserResponse;
import com.example.backend.dtos.response.MeResponse;
import com.example.backend.dtos.response.RegisterUserResponse;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
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
    public ResponseEntity<LoginUserResponse> loginUser(@RequestBody @Valid LoginUserRequest loginRequest, HttpServletResponse resp) {
        return ResponseEntity.ok(userService.login(loginRequest, resp));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        com.example.backend.entities.User byEmail = userService.findByEmail(user.getUsername());

        MeResponse meResponse = new MeResponse();
        meResponse.setEmail(byEmail.getEmail());
        meResponse.setName(byEmail.getName());

        return ResponseEntity.ok(meResponse);
    }

}

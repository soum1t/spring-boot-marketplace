package com.example.backend.service;

import com.example.backend.dtos.request.LoginUserRequest;
import com.example.backend.dtos.request.RegisterUserRequest;
import com.example.backend.dtos.response.LoginUserResponse;
import com.example.backend.dtos.response.RegisterUserResponse;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    @Transactional
    public RegisterUserResponse register(RegisterUserRequest registerUser) throws Exception {

        Optional<User> existingUser = userRepository.findByEmail(registerUser.getEmail());

        if (existingUser.isPresent()) {
            throw new Exception("Email is already in use.");
        }

        User user = User.builder()
                .name(registerUser.getName())
                .email(registerUser.getEmail())
                .password(passwordEncoder.encode(registerUser.getPassword()))
                .build();

        userRepository.save(user);

        return RegisterUserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .message("User registered successfully.")
                .build();
    }

    public LoginUserResponse login(LoginUserRequest loginRequest, HttpServletResponse resp) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        Authentication authentication1 = authenticationManager.authenticate(authentication);

        if (!authentication1.isAuthenticated()) throw new BadCredentialsException("Invalid email or password.");

        Cookie cookie = new Cookie("token", jwtUtil.generateToken(authentication1.getName()));
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        resp.addCookie(cookie);

        LoginUserResponse loginUserResponse = new LoginUserResponse();
        loginUserResponse.setMessage("Login successful.");
        return loginUserResponse;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}

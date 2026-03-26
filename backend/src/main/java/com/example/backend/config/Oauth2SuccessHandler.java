package com.example.backend.config;

import com.example.backend.dtos.request.RegisterUserRequest;
import com.example.backend.service.UserService;
import com.example.backend.utils.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final UserService userService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        assert oidcUser != null;
        String email = oidcUser.getClaims().get("email").toString();
        String name = oidcUser.getClaims().get("name").toString();

        RegisterUserRequest registerUserRequest = new RegisterUserRequest();
        registerUserRequest.setEmail(email);
        registerUserRequest.setName(name);
        registerUserRequest.setPassword(null);

        try {
            userService.register(registerUserRequest);
        } catch (Exception e) {
            System.out.println("User already exists, skipping registration.");
        }


        String token = jwtUtil.generateToken(email);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(cookie);
        response.sendRedirect("/");
    }
}

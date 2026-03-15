package com.example.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;
    private List<String> excludedUrls = List.of("/user/register", "/user/login");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        for (String urls : excludedUrls) {
            if (request.getServletPath().equals(urls)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        String token = extractJwtFromRequest(request);

        if (token != null) {
            JWTAuthenticationToken jwtToken = new JWTAuthenticationToken(token);
            Authentication authentication = authenticationManager.authenticate(jwtToken);
            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

}

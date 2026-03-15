package com.example.backend.config;

import lombok.Data;
import lombok.Getter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class JWTAuthenticationToken extends AbstractAuthenticationToken {

    private final String token;

    public JWTAuthenticationToken(String token) {
        super((Collection<? extends GrantedAuthority>) null);
        this.token = token;
        setAuthenticated(false);
    }

    @Override
    public @Nullable Object getCredentials() {
        return null;
    }

    @Override
    public @Nullable Object getPrincipal() {
        return null;
    }
}

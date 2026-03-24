package com.example.backend.config;

import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.JWTUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> {
            Optional<User> byEmail = userRepository.findByEmail(username);
            if (byEmail.isEmpty()) throw new UsernameNotFoundException("User not found with email: " + username);
            return org.springframework.security.core.userdetails.User.builder()
                    .username(byEmail.get().getEmail())
                    .password(byEmail.get().getPassword())
                    .roles("USER") // You can customize roles as needed
                    .build();
        };
    }
    
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public JWTAuthenticationProvider jwtAuthenticationProvider(JWTUtil jwtUtil, UserDetailsService userDetailsService) {
        return new JWTAuthenticationProvider(jwtUtil, userDetailsService);
    }

    @Bean
    public AuthenticationManager authenticationManager(DaoAuthenticationProvider daoAuthenticationProvider, JWTAuthenticationProvider jwtAuthenticationProvider) {
        return new ProviderManager(Arrays.asList(
                daoAuthenticationProvider,
                jwtAuthenticationProvider
        ));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {

        JWTFilter jwtFilter = new JWTFilter(authenticationManager);

        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/user/register").permitAll()
                        .requestMatchers("/user/login").permitAll()
                        .requestMatchers("/public/**", "/error").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(
                                (req, res, auth) -> {
                                    OidcUser oidcUser = (OidcUser) auth.getPrincipal();
                                    assert oidcUser != null;
                                    log.info("Oauth2 login successfull, name: {}, email: {}", oidcUser.getClaims().get("name"), oidcUser.getClaims().get("email"));
                                })
                        .failureHandler(
                                (req, res, exp) -> {
                                    log.error("OAuth2 login failed: {}", exp.getMessage());
                                })
                )
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}

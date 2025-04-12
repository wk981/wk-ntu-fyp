package com.wgtpivotlo.wgtpivotlo.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Value("${spring.cors.url}")
    private String corsURLList;

    private final UserDetailsService userDetailsService;

    public SecurityConfiguration(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authorize) ->
                authorize
                        .requestMatchers(HttpMethod.POST, "/api/login", "/api/register", "api/v1/skill/search").permitAll()
                        .requestMatchers("/api/me").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/v1/career/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/v1/career/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/career/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/skill/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/v1/skill/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/skill/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/course/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/v1/course/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/course/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/course-skill-association/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/v1/course-skill-association/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/course-skill-association/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/career-skill-association/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/v1/career-skill-association/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/v1/career-skill-association/").hasRole("ADMIN")
                        .anyRequest().authenticated() // AuthorizationFilter
        )
        .csrf(AbstractHttpConfigurer::disable) // CSRFFilter, disabled
        .logout((logout) -> logout
                .logoutSuccessHandler((httpServletRequest, httpServletResponse, authentication) -> {
                    httpServletResponse.setStatus(HttpServletResponse.SC_OK);
                })
                .logoutUrl("/api/logout") // URL to trigger logout
                .invalidateHttpSession(true) // Invalidate session
                .deleteCookies("JSESSIONID") // Delete session cookie
                .permitAll()
        ) // LogoutFilter
        .cors((cors) -> cors
                .configurationSource(corsConfigurationSource())
        ); //CorsFilter
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        String[] parts = corsURLList.split(",");
        List<String> corsURL = new ArrayList<>();
        Collections.addAll(corsURL, parts);

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsURL); //allows React to access the API from origin on port 3000. Change accordingly
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

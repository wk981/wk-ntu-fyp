package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.LoginRequest;
import com.wgtpivotlo.wgtpivotlo.dto.MessageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.RegisterRequest;
import com.wgtpivotlo.wgtpivotlo.dto.UserDTO;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import com.wgtpivotlo.wgtpivotlo.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<MessageDTO> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        authService.loginUser(request, loginRequest);
        MessageDTO message = MessageDTO.builder().message("Login success!").build();
        return ResponseEntity.ok(message);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageDTO> register(@RequestBody RegisterRequest registerRequest){
        authService.registerUser(registerRequest);
        MessageDTO message = MessageDTO.builder().message("Registered success!").build();
        return ResponseEntity.ok(message);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        List<String> roles = authorities.stream().map(Object::toString).collect(Collectors.toList());
        UserDTO userDTO = UserDTO
                            .builder()
                            .id(userDetails.getId())
                            .username(userDetails.getUsername())
                            .email(userDetails.getEmail())
                            .pic(userDetails.getPic())
                            .role(roles)
                            .build();
        return ResponseEntity.ok(userDTO);
    }
}

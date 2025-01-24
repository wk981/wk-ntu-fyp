package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.LoginRequest;
import com.wgtpivotlo.wgtpivotlo.dto.MessageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.RegisterRequest;
import com.wgtpivotlo.wgtpivotlo.dto.UserDTO;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import com.wgtpivotlo.wgtpivotlo.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
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
        return ResponseEntity.ok(authService.getUser(authentication));
    }
}

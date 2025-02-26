package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.MessageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.UserUpdateRequest;
import com.wgtpivotlo.wgtpivotlo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/update-profile")
    public ResponseEntity<MessageDTO> updateUser(@Valid @RequestBody UserUpdateRequest request, Authentication authentication) throws AccessDeniedException {
        userService.updateUser(request,authentication);
        MessageDTO message = MessageDTO.builder().message("Profile updated successfully").build();
        return ResponseEntity.ok(message);
    }
}

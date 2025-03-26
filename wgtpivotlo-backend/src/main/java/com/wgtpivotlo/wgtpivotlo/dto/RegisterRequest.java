package com.wgtpivotlo.wgtpivotlo.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
public class RegisterRequest extends LoginRequest{
    @Email
    private String email;

    public RegisterRequest(String username, String password, String email) {
        super(username, password);
        this.email = email;
    }
}

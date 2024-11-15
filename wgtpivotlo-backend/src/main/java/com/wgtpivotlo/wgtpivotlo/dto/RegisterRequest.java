package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
public class RegisterRequest extends LoginRequest{
    private String email;

    public RegisterRequest(String username, String password, String email) {
        super(username, password);
        this.email = email;
    }
}

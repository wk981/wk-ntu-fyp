package com.wgtpivotlo.wgtpivotlo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Data
public class UserUpdateRequest {
    @NotNull(message = "ID cannot be null")
    @Positive(message = "ID must be a positive number")
    private Long userId;

    @Email(message = "Email should be valid")
    private String newEmail;

    private String newUsername;

    public UserUpdateRequest(Long userId, String newEmail, String newUsername){
        this.userId = userId;
        this.newEmail = newEmail;
        this.newUsername = newUsername;
    }
}

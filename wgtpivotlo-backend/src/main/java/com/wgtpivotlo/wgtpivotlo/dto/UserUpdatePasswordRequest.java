package com.wgtpivotlo.wgtpivotlo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Data
public class UserUpdatePasswordRequest {
    @NotNull(message = "ID cannot be null")
    @Positive(message = "ID must be a positive number")
    private Long userId;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "New password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must include at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "Password must include at least one lowercase letter")
    @Pattern(regexp = ".*\\d.*", message = "Password must include at least one number")
    @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "Password must include at least one special character")
    private String currentPassword;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "New password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must include at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "Password must include at least one lowercase letter")
    @Pattern(regexp = ".*\\d.*", message = "Password must include at least one number")
    @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "Password must include at least one special character")
    private String newPassword;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "New password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must include at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "Password must include at least one lowercase letter")
    @Pattern(regexp = ".*\\d.*", message = "Password must include at least one number")
    @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "Password must include at least one special character")
    private String confirmNewPassword;

    public UserUpdatePasswordRequest(Long userId, String currentPassword, String newPassword, String confirmNewPassword) {
        this.userId = userId;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }
}

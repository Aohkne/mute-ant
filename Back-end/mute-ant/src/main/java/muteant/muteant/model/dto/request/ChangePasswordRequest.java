package muteant.muteant.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotNull(message = "Username is required")
    private String username;
    @NotNull(message = "Old password is required")
    private String oldPassword;
    @NotNull(message = "New password is required")
    private String newPassword;
    @NotNull(message = "Re-new password is required")
    private String reNewPassword;
}

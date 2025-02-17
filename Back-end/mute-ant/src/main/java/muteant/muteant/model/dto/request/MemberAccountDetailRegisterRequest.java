package muteant.muteant.model.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberAccountDetailRegisterRequest {

    @NotNull(message = "Username is required")
    private String username;

    @NotNull(message = "Password is required")
    private String password;

    @NotNull(message = "Re-password is required")
    private String rePassword;

    @NotNull(message = "Full name is required")
    private String full_name;

    @NotNull(message = "Email is required")
    private String email;

    @NotNull(message = "Role is required")
    private String role;


    private String image;

    private LocalDate birthdate;

    private String gender;

    @NotNull(message = "Is_active is required")
    private Boolean is_active;
}

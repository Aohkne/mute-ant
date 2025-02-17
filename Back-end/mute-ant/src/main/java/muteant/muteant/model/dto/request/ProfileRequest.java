package muteant.muteant.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Fulls name is required")
    private String full_name;

    @NotBlank(message = "Role is required")
    private String role;

    private String gender;

    private String image;

    private LocalDate birthdate;

    private Boolean is_active;
}

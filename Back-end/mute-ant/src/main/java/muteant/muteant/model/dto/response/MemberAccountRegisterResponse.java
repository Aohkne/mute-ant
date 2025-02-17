package muteant.muteant.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MemberAccountRegisterResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String image;
    private LocalDate birthdate;
    private String gender;
    private LocalDateTime created_date;
    private LocalDateTime updated_date;
    private Boolean is_active;
}

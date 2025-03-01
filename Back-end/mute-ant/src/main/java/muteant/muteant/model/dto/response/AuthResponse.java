package muteant.muteant.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthResponse {
    private Long userId;
    private String accessToken;
    private String refreshToken;
    private String role;
}

package muteant.muteant.model.other;

import muteant.muteant.model.constant.JwtTokenType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserClaims implements Serializable {
    private String username;
    private List<String> roles;
    private JwtTokenType tokenType;
}

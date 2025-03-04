package muteant.muteant.model.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {
    private Long id;
    private Long userId;
    private Boolean isActive;
    private LocalDateTime created_date;
}
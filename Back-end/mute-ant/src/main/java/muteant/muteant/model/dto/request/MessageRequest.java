package muteant.muteant.model.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private Long conversationId;
    private String sender;
    private String messageText;
    private Boolean isActive;
}

package muteant.muteant.model.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private Long conversationId;
    private String sender;
    private String messageText;
    private Boolean isActive;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
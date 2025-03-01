package muteant.muteant.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessagesEntity extends BaseEntity {

    @ManyToOne(targetEntity = ConversationsEntity.class, fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "conversation_id", nullable = false)
    private ConversationsEntity conversationsId;

    @Column(name = "sender", nullable = false)
    private String sender;

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String message_text;

    @Column(name = "is_active", nullable = false)
    private Boolean is_active;
}

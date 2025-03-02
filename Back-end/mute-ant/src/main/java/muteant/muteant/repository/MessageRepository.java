package muteant.muteant.repository;

import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.model.entity.ConversationsEntity;
import muteant.muteant.model.entity.MessagesEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends BaseRepository<MessagesEntity, Long> {
    List<MessagesEntity> findByConversationsId(ConversationsEntity  conversationId);
}

package muteant.muteant.repository;

import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.model.entity.ConversationsEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends BaseRepository<ConversationsEntity, Long> {
    List<ConversationsEntity> findByUserId(AccountEntity userId);
}
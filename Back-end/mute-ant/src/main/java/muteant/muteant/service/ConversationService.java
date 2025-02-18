package muteant.muteant.service;

import muteant.muteant.model.dto.request.ConversationRequest;
import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.ConversationResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;

import java.util.List;
public interface ConversationService {
    PaginationWrapper<List<ConversationResponse>> getAllConversations(QueryWrapper queryWrapper);

    ConversationResponse getConversationById(Long id);

    ConversationResponse createConversation(ConversationRequest conversationRequest);

    ConversationResponse updateConversation(Long id, ConversationRequest conversationRequest);

    void deleteConversation(Long id);

    void publishConversation(Long id);

    void unpublishConversation(Long id, Long requestUserId);

//    List<ConversationResponse> getConversationsByAuthorId(Long authorId);


}

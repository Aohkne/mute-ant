package muteant.muteant.service;

import muteant.muteant.model.dto.request.*;
import muteant.muteant.model.dto.response.AuthResponse;
import muteant.muteant.model.dto.response.ConversationResponse;
import muteant.muteant.model.dto.response.MessageResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import muteant.muteant.model.entity.ConversationsEntity;

import java.util.List;


public interface MessageService {
    PaginationWrapper<List<MessageResponse>> getAllMessagePagination(QueryWrapper queryWrapper);
    MessageResponse createMessage(MessageRequest messageRequest);
    MessageResponse updateMessage(Long id, MessageRequest messageRequest);
    MessageResponse getMessageById(Long id);
    void deleteMessage(Long id);
    List<MessageResponse> getMessagesByConversationId(Long conversationId);
    Long getTotalMessageBySender(String sender);
}

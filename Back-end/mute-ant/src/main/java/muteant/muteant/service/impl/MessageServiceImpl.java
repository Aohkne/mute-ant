package muteant.muteant.service.impl;

import muteant.muteant.model.dto.request.MessageRequest;
import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.MessageResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import muteant.muteant.model.entity.ConversationsEntity;
import muteant.muteant.model.entity.MessagesEntity;
import muteant.muteant.model.exception.ActionFailedException;
import muteant.muteant.model.exception.ValidationException;
import muteant.muteant.repository.ConversationRepository;
import muteant.muteant.repository.MessageRepository;
import muteant.muteant.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    @Override
    public PaginationWrapper<List<MessageResponse>> getAllMessagePagination(QueryWrapper queryWrapper) {
        return messageRepository.query(queryWrapper,
                messageRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToResponse).toList();
                    return new PaginationWrapper.Builder<List<MessageResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getMessageById(Long id) {
        MessagesEntity message = messageRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Message not found"));

        return mapToResponse(message);
    }


    @Override
    @Transactional
    public MessageResponse createMessage(MessageRequest request) {
        ConversationsEntity conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new ValidationException("Conversation not found"));

        MessagesEntity message = MessagesEntity.builder()
                .conversationsId(conversation)
                .sender(request.getSender())
                .message_text(request.getMessageText())
                .is_active(request.getIsActive())
                .build();

        MessagesEntity savedMessage = messageRepository.save(message);
        return mapToResponse(savedMessage);
    }

    @Override
    @Transactional
    public MessageResponse updateMessage(Long id, MessageRequest request) {
        MessagesEntity message = messageRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Message not found"));

        message.setMessage_text(request.getMessageText());
        message.setIs_active(request.getIsActive());
        message.setUpdatedDate(LocalDateTime.now());

        MessagesEntity updatedMessage = messageRepository.save(message);
        return mapToResponse(updatedMessage);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        MessagesEntity message = messageRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Message not found"));

        messageRepository.delete(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByConversationId(Long conversationId) {
        ConversationsEntity conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ValidationException("Conversation not found"));

        List<MessagesEntity> messages = messageRepository.findByConversationsId(conversation);

        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse mapToResponse(MessagesEntity message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversationsId().getId())
                .sender(message.getSender())
                .messageText(message.getMessage_text())
                .isActive(message.getIs_active())
                .createdDate(message.getCreatedDate())
                .updatedDate(message.getUpdatedDate())
                .build();
    }
}

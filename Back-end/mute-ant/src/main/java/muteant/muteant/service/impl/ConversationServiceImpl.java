package muteant.muteant.service.impl;

import muteant.muteant.model.dto.request.ConversationRequest;
import muteant.muteant.model.dto.response.ConversationResponse;
import muteant.muteant.model.entity.ConversationsEntity;
import muteant.muteant.repository.ConversationRepository;
import muteant.muteant.service.ConversationService;

import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.PaginationWrapper;
import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.model.exception.ActionFailedException;
import muteant.muteant.model.exception.ValidationException;
import muteant.muteant.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {
    private final AccountRepository accountRepository;
    private final ConversationRepository conversationRepository;

    @Transactional
    @Override
    public PaginationWrapper<List<ConversationResponse>> getAllConversations(QueryWrapper queryWrapper) {
        return conversationRepository.query(queryWrapper,
                conversationRepository::queryAnySpecification,
                (items) -> {
                    var list = items
                            .map(this::wrapConversationResponse)
                            .toList();
                    return new PaginationWrapper.Builder<List<ConversationResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Transactional
    @Override
    public ConversationResponse getConversationById(Long id) {
        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Conversation not found"));
        return wrapConversationResponse(conversation);
    }

    @Transactional
    @Override
    public ConversationResponse createConversation(ConversationRequest conversationRequest) {
        AccountEntity author = accountRepository.findById(conversationRequest.getUserId())
                .orElseThrow(() -> new ValidationException("Author not found"));

        var conversation = ConversationsEntity.builder()
                .userId(author)
                .is_active(conversationRequest.getIsActive())
                .build();

        conversationRepository.save(conversation);
        return wrapConversationResponse(conversation);
    }

    @Transactional
    @Override
    public ConversationResponse updateConversation(Long id, ConversationRequest conversationRequest) {
        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Conversation not found"));

        conversation.setIs_active(conversationRequest.getIsActive());
        conversation.setUpdatedDate(LocalDateTime.now());

        conversationRepository.save(conversation);
        return wrapConversationResponse(conversation);
    }

    @Transactional
    @Override
    public void deleteConversation(Long id) {
        if (!conversationRepository.existsById(id)) {
            throw new ValidationException("Conversation not found");
        }
        try {
            conversationRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete conversation", ex);
        }
    }

    @Transactional
    @Override
    public void publishConversation(Long id) {
        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Conversation not found"));
        conversation.setIs_active(true);
        conversation.setUpdatedDate(LocalDateTime.now());
        conversationRepository.save(conversation);
    }

    @Transactional
    @Override
    public void unpublishConversation(Long id, Long requestUserId) {
        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Conversation not found"));

        var requestUser = accountRepository.findById(requestUserId)
                .orElseThrow(() -> new ValidationException("User not found"));

        if (!conversation.getUserId().getId().equals(requestUserId) && !"ADMIN".equals(requestUser.getRole())) {
            throw new ActionFailedException("You do not have permission to unpublish this conversation");
        }
        conversation.setIs_active(false);
        conversation.setUpdatedDate(LocalDateTime.now());
        conversationRepository.save(conversation);
    }

//    @Transactional(readOnly = true)
//    @Override
//    public List<ConversationResponse> getConversationsByAuthorId(Long authorId) {
//        var account = accountRepository.findById(authorId)
//                .orElseThrow(() -> new ValidationException("Author not found"));
//
//        var conversations = conversationRepository.findByUserId(account);
//        if (conversations.isEmpty()) {
//            throw new ValidationException("No conversations found for the given author");
//        }
//
//        return conversations.stream()
//                .map(this::wrapConversationResponse)
//                .toList();
//    }


    private ConversationResponse wrapConversationResponse(ConversationsEntity conversation) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .userId(conversation.getUserId().getId())
                .created_date(conversation.getCreatedDate())
                .isActive(conversation.getIs_active())
                .build();
    }
}
package muteant.muteant.controller;

import muteant.muteant.model.dto.request.MessageRequest;
import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.MessageResponse;
import muteant.muteant.model.dto.response.ResponseObject;
import muteant.muteant.model.entity.ConversationsEntity;
import muteant.muteant.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/messages")
public class MessageController {

    private final MessageService messageService;

    @Operation(summary = "Get all messages", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping
    public ResponseEntity<ResponseObject<List<MessageResponse>>> getAllMessages(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Order.by(sort.split(",")[0]).with(Sort.Direction.fromString(sort.split(",")[1]))));

        var paginationResult = messageService.getAllMessagePagination(QueryWrapper.builder()
                .search(query)
                .wrapSort(pageable)
                .build());

        return ResponseEntity.ok(new ResponseObject.Builder<List<MessageResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(paginationResult.getData())
                .message("Get messages success")
                .build());
    }

    @Operation(summary = "Get message by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<MessageResponse>> getMessageById(@PathVariable Long id) {
        var message = messageService.getMessageById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<MessageResponse>()
                .success(true)
                .code("SUCCESS")
                .content(message)
                .message("Get message success")
                .build());
    }

    @Operation(summary = "Create a new message", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    public ResponseEntity<ResponseObject<MessageResponse>> createMessage(@RequestBody MessageRequest messageRequest) {
        var message = messageService.createMessage(messageRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<MessageResponse>()
                .success(true)
                .code("SUCCESS")
                .content(message)
                .message("Create message success")
                .build());
    }

    @Operation(summary = "Update a message by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject<MessageResponse>> updateMessage(@PathVariable Long id,
                                                                         @RequestBody MessageRequest messageRequest) {
        var message = messageService.updateMessage(id, messageRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<MessageResponse>()
                .success(true)
                .code("SUCCESS")
                .content(message)
                .message("Update message success")
                .build());
    }

    @Operation(summary = "Delete a message by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject<Void>> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete message success")
                .build());
    }

    @Operation(summary = "Get messages by conversation ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ResponseObject<List<MessageResponse>>> getMessagesByConversationId(@PathVariable Long conversationId) {
        var messages = messageService.getMessagesByConversationId(conversationId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<MessageResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(messages)
                .message("Get messages by conversation ID success")
                .build());
    }

}

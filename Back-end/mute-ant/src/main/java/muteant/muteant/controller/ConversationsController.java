package muteant.muteant.controller;

import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.request.ConversationRequest;
import muteant.muteant.model.dto.response.ConversationResponse;
import muteant.muteant.model.dto.response.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import muteant.muteant.service.ConversationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/conversations", produces = MediaType.APPLICATION_JSON_VALUE)
public class ConversationsController {
    private final ConversationService conversationService;

    @Operation(summary = "Get all conversations", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping
    public ResponseEntity<ResponseObject<List<ConversationResponse>>> getAllConversations(
            @RequestParam(name = "q", required = false) String query,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var paginationResult = conversationService.getAllConversations(QueryWrapper.builder()
                .search(query)
                .wrapSort(pageable)
                .build());

        return ResponseEntity.ok(new ResponseObject.Builder<List<ConversationResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(paginationResult.getData())
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get conversation by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<ConversationResponse>> getConversationById(@PathVariable Long id) {
        var conversation = conversationService.getConversationById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<ConversationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(conversation)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new conversation", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    public ResponseEntity<ResponseObject<ConversationResponse>> createConversation(@RequestBody ConversationRequest conversationRequest) {
        var conversation =conversationService.createConversation(conversationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<ConversationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(conversation)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update a conversation by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject<ConversationResponse>> updateConversation(@PathVariable Long id,
                                                                           @RequestBody ConversationRequest conversationRequest) {
        var conversation = conversationService.updateConversation(id, conversationRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<ConversationResponse>()
                .success(true)
                .code("SUCCESS")
                .content(conversation)
                .message("Update Success")
                .build());
    }

    @Operation(summary = "Get conversations by author ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/author/{authorId}")
    public ResponseEntity<ResponseObject<List<ConversationResponse>>> getConversationsByAuthorId(@PathVariable Long authorId) {
        var conversations = conversationService.getConversationsByAuthorId(authorId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<ConversationResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(conversations)
                .message("Get conversations by author ID success")
                .build());
    }

    @PatchMapping("/publish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_BCN')")
    @Operation(summary = "Publish a conversation by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> publishConversation(@PathVariable Long id) {
        conversationService.publishConversation(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Publish Success")
                .build());
    }

    @PatchMapping("/unpublish/{id}")
    @Operation(summary = "Unpublish a conversation by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> unpublishConversation(@PathVariable Long id,
                                                                      @RequestParam Long requestId) {
        conversationService.unpublishConversation(id,requestId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Unpublish Success")
                .build());
    }

    @Operation(summary = "Delete a conversation by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteConversation(@PathVariable Long id) {
        conversationService.deleteConversation(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @Operation(summary = "Get total conversation count for a specific month", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/stats/monthly-total/{year}/{month}")
    public ResponseEntity<ResponseObject<Map<String, Object>>> getMonthlyConversationTotal(
            @PathVariable int year,
            @PathVariable int month) {
        Long monthlyTotal = conversationService.getMonthlyConversationCount(year, month);

        Map<String, Object> response = new HashMap<>();
        response.put("year", year);
        response.put("month", month);
        response.put("monthlyTotal", monthlyTotal);
        response.put("dailyBreakdown", conversationService.getConversationCountByDayForMonth(year, month));

        return ResponseEntity.ok(new ResponseObject.Builder<Map<String, Object>>()
                .success(true)
                .code("SUCCESS")
                .content(response)
                .message("Get monthly conversation statistics success")
                .build());
    }

}
package muteant.muteant.controller;

import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.request.MemberAccountDetailRegisterRequest;
import muteant.muteant.model.dto.request.ProfileRequest;
import muteant.muteant.model.dto.response.MemberAccountRegisterResponse;
import muteant.muteant.model.dto.response.ProfileResponse;
import muteant.muteant.model.dto.response.ResponseObject;
import muteant.muteant.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("accounts")
public class AccountController {
    private final AccountService accountService;


    @GetMapping
    @Operation(summary = "Get all accounts", description = "This API will return all accounts", security = {
            @SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<ProfileResponse>>> getAllAccounts(@RequestParam(name = "q", required = false) String query,
                                                                                @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = accountService.getAllMemberPagination(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<ProfileResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Accounts retrieved successfully")
                .build());
    }

    @PostMapping("members/register/full")
    @Operation(summary = "Register Member Account",
            security = {}
    )
    public ResponseEntity<ResponseObject<MemberAccountRegisterResponse>> registerMemberAccountFull(@Valid @RequestBody MemberAccountDetailRegisterRequest request) {
        var result = accountService.registerMemberAccountFull(request);
        return ResponseEntity.ok(new ResponseObject.Builder<MemberAccountRegisterResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Create Success")
                .build());
    }

    @GetMapping("check-username")
    @Operation(summary = "Check Account Username Exist",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Map<String, Boolean>>> validateUsername(@RequestParam String username) {
        var exist = accountService.checkUsernameExist(username);
        return ResponseEntity.ok(new ResponseObject.Builder<Map<String, Boolean>>()
                .success(true)
                .code("SUCCESS")
                .content(Map.of("exists", exist))
                .message(exist ? "Username Exist" : "Username Not Exist")
                .build());
    }

    @GetMapping("{id}")
    @Operation(summary = "Get Account By ID",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<ProfileResponse>> getAccountById(@PathVariable Long id) {
        var result = accountService.getAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<ProfileResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get Account Success")
                .build());
    }

    @PutMapping("{id}")
    @Operation(summary = "Update Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<ProfileResponse>> updateAccount(@PathVariable Long id,
                                                                         @Valid @RequestBody ProfileRequest request) {
        var result = accountService.updateMemberAccount(id, request);
        return ResponseEntity.ok(new ResponseObject.Builder<ProfileResponse>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Update Success")
                .build());
    }

    @PatchMapping("disable/{id}")
    @Operation(summary = "Disable Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Void>> disableAccount(@PathVariable Long id) {
        accountService.disableAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Account disabled successfully")
                .build());
    }

    @PatchMapping("enable/{id}")
    @Operation(summary = "Enable Account",
            security = {@SecurityRequirement(name = "accessCookie")}
    )
    public ResponseEntity<ResponseObject<Void>> enableAccount(@PathVariable Long id) {
        accountService.enableAccountById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Account enable successfully")
                .build());
    }

    @GetMapping("roles/me")
    @Operation(summary = "Get current account role", description = "This API will return current role", security = {
            @SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<String>>> getCurrentAccountRole() {
        var result = accountService.getUserCurrentRole();
        return ResponseEntity.ok(new ResponseObject.Builder<List<String>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Get account role successfully")
                .build());
    }

}
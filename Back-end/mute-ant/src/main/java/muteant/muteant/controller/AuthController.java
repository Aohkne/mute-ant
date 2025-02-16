package muteant.muteant.controller;

import muteant.muteant.model.dto.request.AuthRequest;
import muteant.muteant.model.dto.response.AuthResponse;
import muteant.muteant.model.dto.response.ResponseObject;
import muteant.muteant.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AccountService accountService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseObject<AuthResponse>> authenticate(@Valid @RequestBody AuthRequest authentication, HttpServletResponse response) {
        var result = authService.memberLocalAuthentication(authentication, (callback) -> {
            callback.forEach(response::addCookie);
        });
        return ResponseEntity.ok(new ResponseObject.Builder<AuthResponse>()
                .code("SUCCESS")
                .content(result)
                .message("Login Success")
                .success(true)
                .build()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok("Logged out successfully");
    }
}

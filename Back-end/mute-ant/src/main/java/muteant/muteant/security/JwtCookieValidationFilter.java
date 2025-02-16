package muteant.muteant.security;

import muteant.muteant.model.constant.JwtTokenType;
import muteant.muteant.service.JwtService;
import muteant.muteant.util.CookieUtils;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtCookieValidationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request,@Nonnull HttpServletResponse response,@Nonnull FilterChain filterChain) throws ServletException, IOException {
        var cookieMap = CookieUtils.getCookieMap(request);
        if (cookieMap.isEmpty()) {
            filterChain.doFilter(request, response);
            return ;
        }
        if (cookieMap.containsKey(JwtTokenType.ACCESS_TOKEN) && jwtService.isTokenValid(cookieMap.get(JwtTokenType.ACCESS_TOKEN).getValue(), JwtTokenType.ACCESS_TOKEN)) {
            jwtService.removeAuthToken(cookieMap.get(JwtTokenType.ACCESS_TOKEN), response);
        }
        if (cookieMap.containsKey(JwtTokenType.REFRESH_TOKEN) && jwtService.isTokenValid(cookieMap.get(JwtTokenType.REFRESH_TOKEN).getValue(), JwtTokenType.REFRESH_TOKEN)) {
            jwtService.removeAuthToken(cookieMap.get(JwtTokenType.REFRESH_TOKEN), response);
        }
        filterChain.doFilter(request, response);
    }
}

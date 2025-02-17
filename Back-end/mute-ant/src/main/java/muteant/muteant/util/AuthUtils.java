package muteant.muteant.util;

import lombok.RequiredArgsConstructor;
import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.repository.AccountRepository;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthUtils {
    private final AccountRepository accountRepository;

    public AccountEntity getUserFromAuthentication() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if(auth == null) throw new AuthenticationException("This user isn't authentication, please login again") {
            };
            String username = auth.getName();
            return accountRepository.findByUsername(username).orElseThrow();
        } catch (Exception ex) {
            throw new AuthenticationException("This user isn't authentication, please login again") {
            };
        }
    }

    public static Collection<GrantedAuthority> convertRoleToAuthority(AccountEntity account) {
        if (account.getRole() == null) {
            return List.of();
        }
        String role_name = account.getRole().toUpperCase();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role_name));
    }

    public static List<String> convertUserToRole(AccountEntity account) {
        return convertRoleToAuthority(account)
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }
}
package muteant.muteant.service.impl;

import muteant.muteant.repository.AccountRepository;
import muteant.muteant.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class CustomUserDetailServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var account = accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .authorities(roleToAuthority(account))
                .build();
    }

    private Collection<GrantedAuthority> roleToAuthority(AccountEntity account) {
        return AuthUtils.convertRoleToAuthority(account);
    }
}
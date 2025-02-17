package muteant.muteant.service.impl;

import muteant.muteant.model.dto.request.*;
import muteant.muteant.model.dto.response.MemberAccountRegisterResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import muteant.muteant.model.dto.response.ProfileResponse;
import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.model.exception.ActionFailedException;
import muteant.muteant.model.exception.ValidationException;
import muteant.muteant.repository.AccountRepository;
import muteant.muteant.service.AccountService;
import muteant.muteant.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import muteant.muteant.util.JwtTokenProvider;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtils authUtils;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JavaMailSender mailSender;

    @Override
    public PaginationWrapper<List<ProfileResponse>> getAllMemberPagination(QueryWrapper queryWrapper) {
        return accountRepository.query(queryWrapper,
                accountRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapAccountResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<ProfileResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    public MemberAccountRegisterResponse registerMemberAccountFull(MemberAccountDetailRegisterRequest request) {
        validatePassword(request.getPassword(), request.getRePassword());

        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Username is already taken");
        }

        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already taken");
        }

        var account = buildAccountEntity(request);
        return saveAccountRegisterAndBuildResponse(account);
    }

    @Override
    public boolean checkUsernameExist(String username) {
        return accountRepository.findByUsername(username).isPresent();
    }

    private void validatePassword(String password, String rePassword) {
        if (password == null || rePassword == null) {
            throw new ValidationException("Password and re-password cannot be null");
        }
        if (!password.equals(rePassword)) {
            throw new ValidationException("Password and re-password do not match");
        }
    }

    private AccountEntity buildAccountEntity(MemberAccountDetailRegisterRequest request) {
        return AccountEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(request.getRole())
                .fullName(request.getFull_name())
                .gender(request.getGender())
                .birthdate(request.getBirthdate())
                .isActive(true)
                .build();
    }

    private MemberAccountRegisterResponse saveAccountRegisterAndBuildResponse(AccountEntity account) {
        try {
            var savedAccount = accountRepository.save(account);
            return MemberAccountRegisterResponse.builder()
                    .id(savedAccount.getId())
                    .username(savedAccount.getUsername())
                    .role(savedAccount.getRole())
                    .email(savedAccount.getEmail())
                    .fullName(savedAccount.getFullName())
                    .gender(savedAccount.getGender())
                    .image(savedAccount.getImage())
                    .birthdate(savedAccount.getBirthdate())
                    .created_date(savedAccount.getCreatedDate())
                    .updated_date(savedAccount.getUpdatedDate())
                    .is_active(savedAccount.getIsActive())
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new ValidationException("Account data violates constraints", ex);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to create account", ex);
        }
    }

    @Override
    public MemberAccountRegisterResponse getAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        return MemberAccountRegisterResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .email(account.getEmail())
                .fullName(account.getFullName())
                .role(account.getRole())
                .gender(account.getGender())
                .created_date(account.getCreatedDate())
                .updated_date(account.getUpdatedDate())
                .is_active(account.getIsActive())
                .build();
    }


    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public void disableAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        if (!account.getIsActive()) {
            throw new ValidationException("Account is already disabled");
        }

        account.setIsActive(false);
        account.setUpdatedDate(LocalDateTime.now());

        try {
            accountRepository.save(account);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to disable account", ex);
        }
    }

    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public void enableAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        if (!account.getIsActive()) {
            throw new ValidationException("Account is already able");
        }

        account.setIsActive(true);
        account.setUpdatedDate(LocalDateTime.now());

        try {
            accountRepository.save(account);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to disable account", ex);
        }
    }

//    @Override
//    public AuthResponse authenticate(LoginRequest loginRequest) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        loginRequest.getUsername(),
//                        loginRequest.getPassword()
//                )
//        );
//
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
//        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
//
//        String role = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .findFirst()
//                .orElse(null);
//
//        return AuthResponse.builder()
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .role(role)
//                .build();
//    }
//
//    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
//    @Override
//    public ProfileResponse updateMemberAccount(Long id, ProfileRequest request) {
//        var account = accountRepository.findById(id)
//                .orElseThrow(() -> new ValidationException("Account not found"));
//
//        // Đảm bảo cập nhật thông tin từ request
//        account.setEmail(request.getEmail());
//        account.setFullName(request.getFullName());
//        account.setGender(request.getGender());
//        account.setPhone(request.getPhone());
//        account.setGithub(request.getGithub());
//        account.setStudentCode(request.getStudent_code());
//        account.setMajor(request.getMajor());
//        account.setCurrentTerm(request.getCurrentTerm());
//        account.setBirthday(request.getBirthday());
//        account.setProfileImg(request.getProfileImg());
//        account.setUpdatedDate(LocalDateTime.now());
//
//        try {
//            var updatedAccount = accountRepository.save(account);
//            return ProfileResponse.builder()
//                    .email(updatedAccount.getEmail())
//                    .github(updatedAccount.getGithub())
//                    .student_code(updatedAccount.getStudentCode())
//                    .fullName(updatedAccount.getFullName())
//                    .gender(updatedAccount.getGender())
//                    .phone(updatedAccount.getPhone())
//                    .major(updatedAccount.getMajor())
//                    .birthday(updatedAccount.getBirthday())
//                    .profileImg(updatedAccount.getProfileImg())
//                    .currentTerm(updatedAccount.getCurrentTerm())
//                    .build();
//        } catch (Exception ex) {
//            throw new ActionFailedException("Failed to update account", ex);
//        }
//    }
//
//
//    @Transactional
//    public void resetPassword(String email) {
//        AccountEntity account = accountRepository.findByEmail(email)
//                .orElseThrow(() -> new ValidationException("No account found with this email"));
//
//        String randomPassword = RandomUtils.generateSecurePassword(12L); // Increased password length
//        account.setPassword(passwordEncoder.encode(randomPassword));
//        accountRepository.save(account);
//
//        sendPasswordResetEmail(account, randomPassword);
//    }
//
//    @Override
//    public List<String> getUserCurrentRole() {
//        var account = authUtils.getUserFromAuthentication();
//        return AuthUtils.convertUserToRole(account);
//    }
//
//    @Override
//    public ProfileResponse getProfile() {
//        var account = authUtils.getUserFromAuthentication();
//
//        return buildProfileResponse(account);
//    }
//
//    @Transactional
//    public void changePassword(ChangePasswordRequest changePasswordRequest) {
//        AccountEntity account = accountRepository.findByUsername(changePasswordRequest.getUsername())
//                .orElseThrow(() -> new ValidationException("No account found with this username"));
//
//        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), account.getPassword())) {
//            throw new ValidationException("Old password is incorrect");
//        }
//
//        validateNewPassword(changePasswordRequest.getNewPassword(), changePasswordRequest.getReNewPassword());
//
//        account.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
//        accountRepository.save(account);
//    }
//
//    private void sendPasswordResetEmail(AccountEntity account, String resetInfo) {
//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setTo(account.getEmail());
//        mailMessage.setSubject("Password Reset Request");
//        mailMessage.setText("Your password reset token is: " + resetInfo +
//                "\nThis token will expire in 15 minutes.");
//
//        mailSender.send(mailMessage);
//    }
//
//    private void validateNewPassword(String password, String rePassword) {
//        if (password == null || rePassword == null) {
//            throw new ValidationException("Passwords cannot be null");
//        }
//        if (!password.equals(rePassword)) {
//            throw new ValidationException("Passwords do not match");
//        }
//        if (password.length() < 8) {
//            throw new ValidationException("Password must be at least 8 characters");
//        }
//    }

    private ProfileResponse wrapAccountResponse(AccountEntity account) {
        return buildProfileResponse(account);
    }

    private ProfileResponse buildProfileResponse(AccountEntity account) {
        return ProfileResponse.builder()
                .id(account.getId())
                .email(account.getEmail())
                .fullName(account.getFullName())
                .role(account.getRole())
                .birthdate(account.getBirthdate())
                .image(account.getImage())
                .created_date(account.getCreatedDate())
                .updated_date(account.getUpdatedDate())
                .is_active(account.getIsActive())
                .build();
    }



}
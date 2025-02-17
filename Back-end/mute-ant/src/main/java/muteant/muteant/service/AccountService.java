package muteant.muteant.service;

import muteant.muteant.model.dto.request.*;
import muteant.muteant.model.dto.response.AuthResponse;
import muteant.muteant.model.dto.response.MemberAccountRegisterResponse;
import muteant.muteant.model.dto.response.ProfileResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import java.util.List;
public interface AccountService {
    PaginationWrapper<List<ProfileResponse>> getAllMemberPagination(QueryWrapper queryWrapper);
    MemberAccountRegisterResponse registerMemberAccountFull(MemberAccountDetailRegisterRequest MemberAccountDetailRegisterRequest);
    MemberAccountRegisterResponse getAccountById(Long id);
    boolean checkUsernameExist(String username);
    void disableAccountById(Long id);
    void enableAccountById(Long id);
//    ProfileResponse updateMemberAccount(Long id, ProfileRequest profileRequest);
//    AuthResponse authenticate(LoginRequest loginRequest);
//
//    void changePassword(ChangePasswordRequest changePasswordRequest);
//
//    void resetPassword(String email);
//
//    List<String> getUserCurrentRole();
//
//    ProfileResponse getProfile();
}

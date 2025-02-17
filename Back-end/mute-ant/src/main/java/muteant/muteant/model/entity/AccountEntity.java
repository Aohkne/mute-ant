package muteant.muteant.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "account") // Đổi tên bảng nếu cần
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountEntity extends BaseEntity {

    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "role", nullable = false, length = 10)
    private String role;

    @Column(name = "image")
    private String image;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "gender", length = 6)
    private String gender;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

}

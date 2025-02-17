package muteant.muteant.repository;

import muteant.muteant.model.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends BaseRepository<AccountEntity, Long>{
    Optional<AccountEntity> findByUsername(String username);
    Optional<AccountEntity> findByEmail(String email);
    Optional<AccountEntity> findById(Long id);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}

package muteant.muteant.repository;

import muteant.muteant.model.entity.AccountEntity;
import muteant.muteant.model.entity.BlogEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends BaseRepository<BlogEntity, Long> {
    Optional<BlogEntity> findByStatus(String status);

    @Query("SELECT b FROM BlogEntity b WHERE " +
            "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:authorId IS NULL OR b.author = :author)")
    List<BlogEntity> filterBlogs(
            @Param("title") String title,
            @Param("status") String status,
            @Param("author") Long author
    );
}
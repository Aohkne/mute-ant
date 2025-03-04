package muteant.muteant.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BlogResponse {
    private Long id;
    private String author;
    private String title;
    private String description;
    private String content;
    private String thumbnail;
    private List<String> images;
    private String status;
    private LocalDateTime created_date;
    private LocalDateTime updated_date;
}
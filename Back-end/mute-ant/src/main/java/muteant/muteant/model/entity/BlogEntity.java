package muteant.muteant.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blog")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogEntity extends BaseEntity {

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "thumbnail", length = 255)
    private String thumbnail;

    @ElementCollection
    @CollectionTable(name = "blog_images", joinColumns = @JoinColumn(name = "blog_id"))
    @Column(name = "image_url", length = 255)
    private List<String> images = new ArrayList<>();


    @Column(name = "status", nullable = false)
    private String status;
}
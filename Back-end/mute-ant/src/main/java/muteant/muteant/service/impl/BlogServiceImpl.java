package muteant.muteant.service.impl;

import muteant.muteant.model.dto.request.BlogRequest;
import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.BlogResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import muteant.muteant.model.entity.BlogEntity;
import muteant.muteant.model.exception.ActionFailedException;
import muteant.muteant.model.exception.ValidationException;
import muteant.muteant.repository.AccountRepository;
import muteant.muteant.repository.BlogRepository;
import muteant.muteant.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final AccountRepository accountRepository;
    private final BlogRepository blogRepository;

    @Override
    public PaginationWrapper<List<BlogResponse>> getAllBlogs(QueryWrapper queryWrapper) {
        return blogRepository.query(queryWrapper,
                blogRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapBlogResponse).toList();
                    return new PaginationWrapper.Builder<List<BlogResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public BlogResponse getBlogById(Long id) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));
        return wrapBlogResponse(blog);
    }

    @Transactional
    @Override
    public BlogResponse createBlog(BlogRequest blogRequest) {
        if (blogRequest.getContent() == null || blogRequest.getContent().trim().isEmpty()) {
            throw new ValidationException("Content cannot be null or empty");
        }

        var blog = BlogEntity.builder()
                .title(blogRequest.getTitle())
                .description(blogRequest.getDescription())
                .content(blogRequest.getContent() != null ? blogRequest.getContent() : "")
                .thumbnail(blogRequest.getThumbnail())
                .author(blogRequest.getAuthor())
                .images(blogRequest.getImages())
                .status("DRAFT")
                .build();

        return wrapBlogResponse(blogRepository.save(blog));
    }


    @Transactional
    @Override
    public BlogResponse updateBlog(Long id, BlogRequest blogRequest) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));

        blog.setTitle(blogRequest.getTitle());
        blog.setDescription(blogRequest.getDescription());
        blog.setContent(blogRequest.getContent());
        blog.setThumbnail(blogRequest.getThumbnail());
        blog.setImages(blogRequest.getImages());
        blog.setUpdatedDate(LocalDateTime.now());

        return wrapBlogResponse(blogRepository.save(blog));
    }


    @Transactional
    @Override
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ValidationException("Blog not found");
        }
        try {
            blogRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete blog", ex);
        }
    }

    @Transactional
    @Override
    public void publishBlog(Long id) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));
        blog.setStatus("PUBLISHED");
        blog.setUpdatedDate(LocalDateTime.now());
        blogRepository.save(blog);
    }

    @Transactional
    @Override
    public void unpublishBlog(Long id, Long requestUserId) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));

        var requestUser = accountRepository.findById(requestUserId)
                .orElseThrow(() -> new ValidationException("User not found"));

        if (!"ADMIN".equals(requestUser.getRole())) {
            throw new ActionFailedException("You do not have permission to unpublish this blog");
        }
        blog.setStatus("DRAFT");
        blog.setUpdatedDate(LocalDateTime.now());
        blogRepository.save(blog);
    }

    @Override
    public List<BlogResponse> getBlogsByStatus(String status) {
        return blogRepository.findByStatus(status).stream()
                .map(this::wrapBlogResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlogResponse> filterBlog(String title, String status, Long authorId) {
        List<BlogEntity> blogs = blogRepository.filterBlogs(title,  status,  authorId);
        return blogs.stream().map(this::wrapBlogResponse).collect(Collectors.toList());
    }


    private BlogResponse mapToResponse(BlogEntity blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .description(blog.getDescription())
                .content(blog.getContent())
                .thumbnail(blog.getThumbnail())
                .author(blog.getAuthor())
                .images(blog.getImages())
                .status(blog.getStatus())
                .created_date(blog.getCreatedDate())
                .updated_date(blog.getUpdatedDate())
                .build();
    }

    private BlogResponse wrapBlogResponse(BlogEntity blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .description(blog.getDescription())
                .content(blog.getContent())
                .thumbnail(blog.getThumbnail())
                .author(blog.getAuthor())
                .images(blog.getImages())
                .status(blog.getStatus())
                .created_date(blog.getCreatedDate())
                .updated_date(blog.getUpdatedDate())
                .build();
    }

}
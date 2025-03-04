package muteant.muteant.service;

import muteant.muteant.model.dto.request.BlogRequest;
import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.response.BlogResponse;
import muteant.muteant.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface BlogService {
    PaginationWrapper<List<BlogResponse>> getAllBlogs(QueryWrapper queryWrapper);

    BlogResponse getBlogById(Long id);

    BlogResponse createBlog(BlogRequest blogRequest);

    BlogResponse updateBlog(Long id, BlogRequest blogRequest);

    void deleteBlog(Long id);

    void publishBlog(Long id);

    void unpublishBlog(Long id, Long requestUserId);

    List<BlogResponse> getBlogsByStatus(String title);

    List<BlogResponse> filterBlog(String title, String status, Long authorId);
}
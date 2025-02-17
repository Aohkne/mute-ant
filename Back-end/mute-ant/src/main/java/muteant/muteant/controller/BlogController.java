package muteant.muteant.controller;

import muteant.muteant.model.dto.request.QueryWrapper;
import muteant.muteant.model.dto.request.BlogRequest;
import muteant.muteant.model.dto.response.BlogResponse;
import muteant.muteant.model.dto.response.ResponseObject;
import muteant.muteant.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/blogs", produces = MediaType.APPLICATION_JSON_VALUE)
public class BlogController {
    private final BlogService blogService;

    @Operation(summary = "Get all blogs", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping
    public ResponseEntity<ResponseObject<List<BlogResponse>>> getAllBlogs(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Order.by(sort.split(",")[0]).with(Sort.Direction.fromString(sort.split(",")[1]))));

        var paginationResult = blogService.getAllBlogs(QueryWrapper.builder()
                .search(query)
                .wrapSort(pageable)
                .build());

        return ResponseEntity.ok(new ResponseObject.Builder<List<BlogResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(paginationResult.getData())
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Get blog by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<BlogResponse>> getBlogById(@PathVariable Long id) {
        var blog = blogService.getBlogById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new blog", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    public ResponseEntity<ResponseObject<BlogResponse>> createBlog(@RequestBody BlogRequest blogRequest) {
        var blog = blogService.createBlog(blogRequest);
        System.out.println("blog = " + blog);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update a blog by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject<BlogResponse>> updateBlog(@PathVariable Long id, @RequestBody BlogRequest blogRequest) {
        var blog = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/publish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_BCN')")
    @Operation(summary = "Publish a blog by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> publishBlog(@PathVariable Long id) {
        blogService.publishBlog(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Publish Success")
                .build());
    }

    @PatchMapping("/unpublish/{id}")
    @Operation(summary = "Unpublish a blog by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> unpublishBlog(@PathVariable Long id, @RequestParam Long requestId) {
        blogService.unpublishBlog(id,requestId);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Unpublish Success")
                .build());
    }

    @Operation(summary = "Delete a blog by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter blogs", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<BlogResponse>>>
    filterBlog(@RequestParam(required = false) String title,
               @RequestParam(required = false) String status,
               @RequestParam(required = false) Long authorId) {
        var blogs = blogService.filterBlog(title, status, authorId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<BlogResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(blogs)
                .message("Filter Success")
                .build());
    }
}
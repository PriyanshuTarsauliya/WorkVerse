package com.techjobs.backend.controller;

import com.techjobs.backend.dto.BookmarkDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/jobs/{jobId}/bookmark")
    public ResponseEntity<BookmarkDTO> toggleBookmark(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(bookmarkService.toggleBookmark(user.getUser().getId(), jobId));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<BookmarkDTO>> getUserBookmarks(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(user.getUser().getId()));
    }

    @DeleteMapping("/jobs/{jobId}/bookmark")
    public ResponseEntity<Void> removeBookmark(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long jobId) {
        bookmarkService.removeBookmark(user.getUser().getId(), jobId);
        return ResponseEntity.noContent().build();
    }
}

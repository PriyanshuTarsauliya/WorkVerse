package com.techjobs.backend.service;

import com.techjobs.backend.dto.BookmarkDTO;
import java.util.List;

public interface BookmarkService {
    BookmarkDTO toggleBookmark(Long userId, Long jobId);
    List<BookmarkDTO> getUserBookmarks(Long userId);
    void removeBookmark(Long userId, Long jobId);
}

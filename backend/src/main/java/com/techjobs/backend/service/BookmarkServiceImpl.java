package com.techjobs.backend.service;

import com.techjobs.backend.dto.BookmarkDTO;
import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.entity.Bookmark;
import com.techjobs.backend.entity.Job;
import com.techjobs.backend.repository.BookmarkRepository;
import com.techjobs.backend.repository.JobRepository;
import com.techjobs.backend.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    @Override
    @Transactional
    public BookmarkDTO toggleBookmark(Long userId, Long jobId) {
        var existing = bookmarkRepository.findByUserIdAndJobId(userId, jobId);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return BookmarkDTO.builder().jobId(jobId).bookmarked(false).build();
        }
        Bookmark bookmark = Bookmark.builder().userId(userId).jobId(jobId).build();
        bookmarkRepository.save(bookmark);
        return BookmarkDTO.builder().jobId(jobId).bookmarked(true).createdAt(bookmark.getCreatedAt()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookmarkDTO> getUserBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(bm -> {
                    BookmarkDTO dto = BookmarkDTO.builder()
                            .id(bm.getId())
                            .jobId(bm.getJobId())
                            .bookmarked(true)
                            .createdAt(bm.getCreatedAt())
                            .build();
                    jobRepository.findById(bm.getJobId()).ifPresent(job -> {
                        long appCount = applicationRepository.countByJobId(job.getId());
                        dto.setJob(JobResponseDTO.fromEntity(job, appCount));
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeBookmark(Long userId, Long jobId) {
        bookmarkRepository.findByUserIdAndJobId(userId, jobId)
                .ifPresent(bookmarkRepository::delete);
    }
}

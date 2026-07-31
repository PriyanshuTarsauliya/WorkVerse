package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobRequestDTO;
import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {
    List<JobResponseDTO> getAllJobs(String keyword, JobType jobType, String location, String category);
    Page<JobResponseDTO> getJobsPaged(String keyword, JobType jobType, String location, String category, Pageable pageable);
    JobResponseDTO getJobById(Long id);
    JobResponseDTO createJob(JobRequestDTO requestDTO);
    JobResponseDTO updateJob(Long id, JobRequestDTO requestDTO);
    void deleteJob(Long id);
    List<JobResponseDTO> getJobsByEmployer(Long employerId);
    void incrementViewCount(Long jobId);
}

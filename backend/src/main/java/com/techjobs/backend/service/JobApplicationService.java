package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobApplicationDTO;

import java.util.List;

public interface JobApplicationService {
    JobApplicationDTO applyForJob(Long jobId, JobApplicationDTO applicationDTO);
    List<JobApplicationDTO> getApplicationsForJob(Long jobId);
}

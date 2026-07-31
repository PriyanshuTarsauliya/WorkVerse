package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobApplicationDTO;
import com.techjobs.backend.dto.StatusUpdateDTO;
import com.techjobs.backend.entity.ApplicationStatus;

import java.util.List;

public interface JobApplicationService {
    JobApplicationDTO applyForJob(Long jobId, JobApplicationDTO applicationDTO);
    List<JobApplicationDTO> getApplicationsForJob(Long jobId);
    StatusUpdateDTO.StatusUpdateResponse updateApplicationStatus(Long applicationId, ApplicationStatus newStatus, Long changedByUserId, String notes);
    List<JobApplicationDTO> getApplicationsByUserId(Long userId);
    JobApplicationDTO withdrawApplication(Long applicationId, Long userId);
}

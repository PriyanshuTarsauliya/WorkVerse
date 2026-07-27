package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobApplicationDTO;
import com.techjobs.backend.entity.JobApplication;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.JobApplicationRepository;
import com.techjobs.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public JobApplicationDTO applyForJob(Long jobId, JobApplicationDTO applicationDTO) {
        // Verify job exists
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }

        JobApplication application = JobApplication.builder()
                .jobId(jobId)
                .applicantName(applicationDTO.getApplicantName())
                .applicantEmail(applicationDTO.getApplicantEmail())
                .portfolioUrl(applicationDTO.getPortfolioUrl())
                .coverNote(applicationDTO.getCoverNote())
                .build();

        JobApplication savedApplication = applicationRepository.save(application);
        return JobApplicationDTO.fromEntity(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getApplicationsForJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(JobApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }
}

package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobRequestDTO;
import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobStatus;
import com.techjobs.backend.entity.JobType;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.JobApplicationRepository;
import com.techjobs.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getAllJobs(String keyword, JobType jobType, String location, String category) {
        Page<Job> jobsPage = jobRepository.filterJobs(
            keyword != null ? keyword.toLowerCase() : null,
            jobType,
            location != null ? location.toLowerCase() : null,
            category != null ? category.toLowerCase() : null,
            JobStatus.ACTIVE,
            Pageable.unpaged()
        );
        return mapJobsWithApplicationCounts(jobsPage.getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDTO> getJobsPaged(String keyword, JobType jobType, String location, String category, Pageable pageable) {
        Page<Job> jobsPage = jobRepository.filterJobs(
            keyword != null ? keyword.toLowerCase() : null,
            jobType,
            location != null ? location.toLowerCase() : null,
            category != null ? category.toLowerCase() : null,
            JobStatus.ACTIVE,
            pageable
        );
        List<JobResponseDTO> responseDTOs = mapJobsWithApplicationCounts(jobsPage.getContent());
        return new org.springframework.data.domain.PageImpl<>(responseDTOs, pageable, jobsPage.getTotalElements());
    }

    private List<JobResponseDTO> mapJobsWithApplicationCounts(List<Job> jobs) {
        if (jobs.isEmpty()) return List.of();
        
        List<Long> jobIds = jobs.stream().map(Job::getId).collect(Collectors.toList());
        List<Object[]> counts = applicationRepository.countApplicationsByJobIds(jobIds);
        
        java.util.Map<Long, Long> countsMap = counts.stream()
            .collect(Collectors.toMap(
                row -> (Long) row[0],
                row -> (Long) row[1]
            ));
            
        return jobs.stream()
                .map(job -> JobResponseDTO.fromEntity(job, countsMap.getOrDefault(job.getId(), 0L)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        long appCount = applicationRepository.countByJobId(id);
        return JobResponseDTO.fromEntity(job, appCount);
    }

    @Override
    @Transactional
    public JobResponseDTO createJob(JobRequestDTO requestDTO) {
        Job job = Job.builder()
                .title(requestDTO.getTitle())
                .company(requestDTO.getCompany())
                .location(requestDTO.getLocation())
                .jobType(requestDTO.getJobType())
                .category(requestDTO.getCategory())
                .salaryRange(requestDTO.getSalaryRange())
                .description(requestDTO.getDescription())
                .techStack(requestDTO.getTechStack())
                .experienceLevel(requestDTO.getExperienceLevel())
                .applicationDeadline(requestDTO.getApplicationDeadline())
                .isEasyApply(requestDTO.getIsEasyApply() != null ? requestDTO.getIsEasyApply() : true)
                .employerId(requestDTO.getEmployerId())
                .status(JobStatus.ACTIVE)
                .build();

        Job savedJob = jobRepository.save(job);
        return JobResponseDTO.fromEntity(savedJob, 0L);
    }

    @Override
    @Transactional
    public JobResponseDTO updateJob(Long id, JobRequestDTO requestDTO) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        if (requestDTO.getTitle() != null) job.setTitle(requestDTO.getTitle());
        if (requestDTO.getCompany() != null) job.setCompany(requestDTO.getCompany());
        if (requestDTO.getLocation() != null) job.setLocation(requestDTO.getLocation());
        if (requestDTO.getJobType() != null) job.setJobType(requestDTO.getJobType());
        if (requestDTO.getCategory() != null) job.setCategory(requestDTO.getCategory());
        if (requestDTO.getSalaryRange() != null) job.setSalaryRange(requestDTO.getSalaryRange());
        if (requestDTO.getDescription() != null) job.setDescription(requestDTO.getDescription());
        if (requestDTO.getTechStack() != null) job.setTechStack(requestDTO.getTechStack());
        if (requestDTO.getExperienceLevel() != null) job.setExperienceLevel(requestDTO.getExperienceLevel());
        if (requestDTO.getApplicationDeadline() != null) job.setApplicationDeadline(requestDTO.getApplicationDeadline());
        if (requestDTO.getIsEasyApply() != null) job.setIsEasyApply(requestDTO.getIsEasyApply());

        Job updatedJob = jobRepository.save(job);
        long appCount = applicationRepository.countByJobId(id);
        return JobResponseDTO.fromEntity(updatedJob, appCount);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getJobsByEmployer(Long employerId) {
        List<Job> jobs = jobRepository.findByEmployerIdOrderByCreatedAtDesc(employerId);
        return mapJobsWithApplicationCounts(jobs);
    }

    @Override
    @Transactional
    public void incrementViewCount(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        job.setViewCount(job.getViewCount() != null ? job.getViewCount() + 1 : 1L);
        jobRepository.save(job);
    }
}

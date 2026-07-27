package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobRequestDTO;
import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.entity.Job;
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
                .build();

        Job savedJob = jobRepository.save(job);
        return JobResponseDTO.fromEntity(savedJob, 0L);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        jobRepository.delete(job);
    }
}

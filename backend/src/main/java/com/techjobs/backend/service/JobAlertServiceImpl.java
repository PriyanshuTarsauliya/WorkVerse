package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobAlertDTO;
import com.techjobs.backend.entity.JobAlert;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.JobAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobAlertServiceImpl implements JobAlertService {

    private final JobAlertRepository alertRepository;

    @Override
    @Transactional
    public JobAlertDTO.AlertResponse createAlert(Long userId, JobAlertDTO.CreateAlertRequest req) {
        JobAlert alert = JobAlert.builder()
                .userId(userId)
                .keyword(req.getKeyword())
                .location(req.getLocation())
                .category(req.getCategory())
                .jobType(req.getJobType())
                .salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax())
                .frequency(req.getFrequency() != null ? req.getFrequency() : com.techjobs.backend.entity.AlertFrequency.DAILY)
                .build();
        return JobAlertDTO.AlertResponse.fromEntity(alertRepository.save(alert));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobAlertDTO.AlertResponse> getUserAlerts(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(JobAlertDTO.AlertResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JobAlertDTO.AlertResponse updateAlert(Long userId, Long alertId, JobAlertDTO.CreateAlertRequest req) {
        JobAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("JobAlert", "id", alertId));
        if (!alert.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (req.getKeyword() != null) alert.setKeyword(req.getKeyword());
        if (req.getLocation() != null) alert.setLocation(req.getLocation());
        if (req.getCategory() != null) alert.setCategory(req.getCategory());
        if (req.getJobType() != null) alert.setJobType(req.getJobType());
        if (req.getSalaryMin() != null) alert.setSalaryMin(req.getSalaryMin());
        if (req.getSalaryMax() != null) alert.setSalaryMax(req.getSalaryMax());
        if (req.getFrequency() != null) alert.setFrequency(req.getFrequency());
        return JobAlertDTO.AlertResponse.fromEntity(alertRepository.save(alert));
    }

    @Override
    @Transactional
    public void deleteAlert(Long userId, Long alertId) {
        JobAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("JobAlert", "id", alertId));
        if (!alert.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        alertRepository.delete(alert);
    }
}

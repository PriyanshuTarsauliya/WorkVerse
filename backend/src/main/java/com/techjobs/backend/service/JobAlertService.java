package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobAlertDTO;
import java.util.List;

public interface JobAlertService {
    JobAlertDTO.AlertResponse createAlert(Long userId, JobAlertDTO.CreateAlertRequest request);
    List<JobAlertDTO.AlertResponse> getUserAlerts(Long userId);
    JobAlertDTO.AlertResponse updateAlert(Long userId, Long alertId, JobAlertDTO.CreateAlertRequest request);
    void deleteAlert(Long userId, Long alertId);
}

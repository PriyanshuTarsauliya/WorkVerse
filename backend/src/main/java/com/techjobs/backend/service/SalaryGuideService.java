package com.techjobs.backend.service;

import com.techjobs.backend.dto.SalaryGuideDTO;
import java.util.List;

public interface SalaryGuideService {
    List<SalaryGuideDTO.SalaryResponse> searchSalaries(String role, String location, String experienceLevel);
    List<String> getAvailableRoles();
}

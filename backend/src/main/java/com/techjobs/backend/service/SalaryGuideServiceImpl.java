package com.techjobs.backend.service;

import com.techjobs.backend.dto.SalaryGuideDTO;
import com.techjobs.backend.repository.SalaryDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryGuideServiceImpl implements SalaryGuideService {

    private final SalaryDataRepository salaryDataRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SalaryGuideDTO.SalaryResponse> searchSalaries(String role, String location, String experienceLevel) {
        return salaryDataRepository.searchSalaryData(role, location, experienceLevel).stream()
                .map(SalaryGuideDTO.SalaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAvailableRoles() {
        return salaryDataRepository.findDistinctRoles();
    }
}

package com.techjobs.backend.service;

import com.techjobs.backend.dto.CompanyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyService {
    Page<CompanyDTO.CompanyResponse> searchCompanies(String keyword, Pageable pageable);
    CompanyDTO.CompanyResponse getCompanyById(Long id);
}

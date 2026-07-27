package com.techjobs.backend.service;

import com.techjobs.backend.dto.CompanyDTO;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyDTO.CompanyResponse> searchCompanies(String keyword, Pageable pageable) {
        return companyRepository.searchCompanies(keyword, pageable)
                .map(CompanyDTO.CompanyResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDTO.CompanyResponse getCompanyById(Long id) {
        return companyRepository.findById(id)
                .map(CompanyDTO.CompanyResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
    }
}

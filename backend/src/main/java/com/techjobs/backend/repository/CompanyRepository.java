package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
           "LOWER(c.industry) LIKE CONCAT('%', LOWER(:keyword), '%'))")
    Page<Company> searchCompanies(@Param("keyword") String keyword, Pageable pageable);
}

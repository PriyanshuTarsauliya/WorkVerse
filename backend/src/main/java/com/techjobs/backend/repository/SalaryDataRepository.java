package com.techjobs.backend.repository;

import com.techjobs.backend.entity.SalaryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryDataRepository extends JpaRepository<SalaryData, Long> {

    @Query("SELECT s FROM SalaryData s WHERE " +
           "(:role IS NULL OR LOWER(s.role) LIKE CONCAT('%', LOWER(:role), '%')) AND " +
           "(:location IS NULL OR LOWER(s.location) LIKE CONCAT('%', LOWER(:location), '%')) AND " +
           "(:experienceLevel IS NULL OR LOWER(s.experienceLevel) = LOWER(:experienceLevel))")
    List<SalaryData> searchSalaryData(
            @Param("role") String role,
            @Param("location") String location,
            @Param("experienceLevel") String experienceLevel
    );

    @Query("SELECT DISTINCT s.role FROM SalaryData s ORDER BY s.role")
    List<String> findDistinctRoles();
}

package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(
            String keyword,
            String location,
            JobType jobType,
            String techStack,
            BigDecimal minSalary
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search Keyword (Title, Company, Description)
            if (StringUtils.hasText(keyword)) {
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate companyMatch = cb.like(cb.lower(root.get("company")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, companyMatch, descMatch));
            }

            // Location filter
            if (StringUtils.hasText(location)) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            // Job Type filter
            if (jobType != null) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }

            // Tech Stack skill filter
            if (StringUtils.hasText(techStack)) {
                Join<Job, String> techJoin = root.join("techStack");
                predicates.add(cb.like(cb.lower(techJoin), techStack.toLowerCase()));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

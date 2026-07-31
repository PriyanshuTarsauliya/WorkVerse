package com.techjobs.backend.service;

import com.techjobs.backend.entity.ApplicationStatus;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Lightweight state machine for application status transitions.
 * Enforces that only valid transitions can occur (e.g. cannot go from REJECTED back to OFFERED).
 *
 * Valid transitions:
 *   APPLIED            → UNDER_REVIEW, REJECTED, WITHDRAWN
 *   UNDER_REVIEW       → SHORTLISTED, REJECTED, WITHDRAWN
 *   SHORTLISTED        → INTERVIEW_SCHEDULED, REJECTED, WITHDRAWN
 *   INTERVIEW_SCHEDULED→ OFFERED, REJECTED, WITHDRAWN
 *   OFFERED            → REJECTED, WITHDRAWN
 *   REJECTED           → (terminal)
 *   WITHDRAWN          → (terminal)
 */
@Component
public class StatusTransitionValidator {

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> VALID_TRANSITIONS;

    static {
        VALID_TRANSITIONS = new EnumMap<>(ApplicationStatus.class);

        VALID_TRANSITIONS.put(ApplicationStatus.APPLIED,
                EnumSet.of(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        VALID_TRANSITIONS.put(ApplicationStatus.UNDER_REVIEW,
                EnumSet.of(ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        VALID_TRANSITIONS.put(ApplicationStatus.SHORTLISTED,
                EnumSet.of(ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        VALID_TRANSITIONS.put(ApplicationStatus.INTERVIEW_SCHEDULED,
                EnumSet.of(ApplicationStatus.OFFERED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        VALID_TRANSITIONS.put(ApplicationStatus.OFFERED,
                EnumSet.of(ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        VALID_TRANSITIONS.put(ApplicationStatus.REJECTED, EnumSet.noneOf(ApplicationStatus.class));
        VALID_TRANSITIONS.put(ApplicationStatus.WITHDRAWN, EnumSet.noneOf(ApplicationStatus.class));
    }

    /**
     * @return true if the transition from currentStatus to newStatus is allowed.
     */
    public boolean isValidTransition(ApplicationStatus currentStatus, ApplicationStatus newStatus) {
        Set<ApplicationStatus> allowed = VALID_TRANSITIONS.get(currentStatus);
        return allowed != null && allowed.contains(newStatus);
    }

    /**
     * @return the set of statuses reachable from the given current status.
     */
    public Set<ApplicationStatus> getAllowedTransitions(ApplicationStatus currentStatus) {
        return VALID_TRANSITIONS.getOrDefault(currentStatus, EnumSet.noneOf(ApplicationStatus.class));
    }
}

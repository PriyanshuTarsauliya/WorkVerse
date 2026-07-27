# Contributing to WorkVerse (TechJobs)

Thank you for your interest in contributing to the WorkVerse platform! Follow these guidelines to set up your environment, follow project standards, and submit high-quality pull requests.

---

## 🛠 Branching & Workflow Strategy

1. **Fork & Clone**: Fork the repository and clone your fork locally.
2. **Branch Naming**: Create a topic branch off `develop`:
   - Feature: `feature/description-of-feature`
   - Bug fix: `fix/issue-description`
   - Documentation: `docs/topic-name`
3. **Commit Messages**: Write clear, descriptive commit messages:
   - `feat(auth): add OTP verification endpoint`
   - `fix(jobs): handle null tech stack in criteria specification`
   - `docs(api): update salary guide response parameters`

---

## 🧪 Testing Requirements

### Backend Tests (Spring Boot)
Ensure all JUnit 5 and MockMvc integration tests pass before submitting a PR:
```bash
cd backend
mvn clean test
```

### Frontend Tests (Playwright)
Verify end-to-end user flows:
```bash
cd frontend
npx playwright test
```

---

## 📏 Code Style Guidelines

### Java / Spring Boot
- Use Lombok annotations (`@Data`, `@Builder`, `@RequiredArgsConstructor`) for DTOs and Entities.
- Place REST controllers under `com.techjobs.backend.controller`.
- Enforce explicit authorization annotations (`@PreAuthorize("hasRole('ADMIN')")`) on privileged endpoints.
- Return explicit `ResponseEntity<T>` return types from controller methods.

### React / Frontend
- Use functional components with hooks (`useState`, `useMemo`, `useCallback`).
- Follow established Tailwind CSS tokens defined in `index.css`.
- Ensure all interactive elements handle dark/light themes cleanly.

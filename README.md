# WorkVerse (TechJobs) — Modern Career & Hiring Platform

WorkVerse is a full-stack, interactive job discovery and candidate preparation ecosystem built with **Java 17 (Spring Boot 3.1.5)** and **React 18 (Vite)**. The platform provides real-time job searching with dynamic criteria filtering, 1-click candidate application workflows, DigiLocker identity KYC verification, DPDP Act data privacy controls, Razorpay payment subscription tiers, AI mock interviews, client-side resume parsing, and an employer ATS dashboard.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.1.5 (Java 17)
- **Security**: Spring Security 6 with JWT (`jjwt 0.11.5`) & BCrypt Password Encoder
- **Persistence**: Spring Data JPA & H2 In-Memory Database (Hibernate dialect)
- **Querying**: JPA Criteria API (`JobSpecification.java`) for dynamic search filters
- **Build Tool**: Apache Maven 3.9+
- **Containerization**: Docker (Multi-stage build)

### Frontend
- **Framework**: React 18.3 + Vite 5.2
- **Styling**: Tailwind CSS 3.4 & Custom Glassmorphic Dark/Light CSS
- **Animations**: Framer Motion 11.0 (3D card tilt & smooth modal transitions)
- **Icons**: Lucide React 1.26
- **Document Processing**: `pdfjs-dist` (PDF extraction) & `mammoth` (DOCX parsing)
- **Testing**: Playwright 1.62 (End-to-End browser tests)

---

## 📋 Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 9.0.0 or higher
- **Apache Maven**: Version 3.9+ (or use the bundled `backend/mvnw` / `backend/apache-maven-3.9.6`)
- **Docker** (Optional, for containerized deployment)

---

## 🚀 Quick Start Guide

### 1. Database Setup
The platform runs on an embedded **H2 Database** in memory (`jdbc:h2:mem:techjobsdb`). No separate database installation is required for local development. On backend boot, seed data for default jobs, companies, salary guides, and users is automatically populated by `DataInitializer.java`.

- **H2 Web Console**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:techjobsdb`
- **User**: `sa` | **Password**: *(leave empty)*

### 2. Backend Execution (Spring Boot)

```bash
# Change directory to backend
cd backend

# Build and package application
mvn clean package -DskipTests

# Run Spring Boot backend server
mvn spring-boot:run
```
The REST API will start on **`http://localhost:8080`**.

### 3. Frontend Execution (Vite + React)

```bash
# Change directory to frontend
cd frontend

# Install NPM packages
npm install

# Start Vite development server
npm run dev
```
The single-page web app will open at **`http://localhost:3000`** (or `http://localhost:5173`).

---

## 📂 Repository Folder Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml                          # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── Dockerfile                             # Multi-stage Docker container build
│   ├── pom.xml                                # Maven build & dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/techjobs/backend/
│       │   │   ├── config/                    # SecurityConfig, WebConfig, DataInitializer
│       │   │   ├── controller/                # 16 REST API Controllers
│       │   │   ├── dto/                       # 23 Request/Response DTO Records & Classes
│       │   │   ├── entity/                    # 26 JPA Entity & Enum models
│       │   │   ├── exception/                 # Global Exception Handling
│       │   │   ├── repository/                # 15 JPA Repositories & Specifications
│       │   │   ├── security/                  # JWT Utils & Custom UserDetailsService
│       │   │   └── service/                   # 17 Business Logic Service implementations
│       │   └── resources/
│       │       └── application.properties     # Spring Boot application configuration
│       └── test/                              # JUnit 5 & MockMvc test suite
└── frontend/
    ├── package.json                           # Dependencies & NPM scripts
    ├── vite.config.js                         # Vite build configuration
    ├── index.html                             # Entry HTML document & theme bootstrap script
    └── src/
        ├── App.jsx                            # Main state container & page view router
        ├── main.jsx                           # React root mount point
        ├── index.css                          # Custom Tailwind directives & theme tokens
        ├── components/                        # 28 Modular React UI Components
        │   ├── auth/                          # AuthModal, DigilockerKYC, DPDPAudit, Onboarding
        │   ├── jobs/                          # JobCards, DeckView, ATS, ApplyModal, FilterBar
        │   ├── prep/                          # AIMockInterview, CodingPlayground, SalaryGuide
        │   └── seo/                           # Structured JSON-LD JobPosting schemas
        ├── types/                             # TypeScript interface definitions
        └── utils/                             # Recommendation engine, theme manager, resume parser
```

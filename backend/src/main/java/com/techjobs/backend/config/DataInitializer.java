package com.techjobs.backend.config;

import com.techjobs.backend.entity.*;
import com.techjobs.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final SalaryDataRepository salaryDataRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedJobs();
        seedCompanies();
        seedSalaryData();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        // Admin User
        User admin = User.builder()
                .name("WorkVerse Admin")
                .email("admin@workverse.in")
                .password(passwordEncoder.encode("admin123"))
                .role("ROLE_ADMIN")
                .phone("+919876543210")
                .headline("Platform Administrator & Compliance Audit Lead")
                .location("Bengaluru, India")
                .kycVerified(true)
                .kycToken("DL-ADMIN-TOKEN-001")
                .dpdpConsentGiven(true)
                .dpdpConsentDate(LocalDateTime.now())
                .build();

        // Candidate User
        User candidate = User.builder()
                .name("Aarav Sharma")
                .email("candidate@workverse.in")
                .password(passwordEncoder.encode("candidate123"))
                .role("ROLE_USER")
                .phone("+919812345678")
                .headline("Senior Full Stack Engineer (React, Node.js, Spring Boot)")
                .location("Bengaluru, India")
                .experienceYears(5)
                .skills(Arrays.asList("React", "TypeScript", "Node.js", "Java", "Spring Boot", "Tailwind CSS"))
                .preferredRemote(true)
                .kycVerified(true)
                .kycToken("DL-TOKEN-8F3A29B01C4D")
                .dpdpConsentGiven(true)
                .dpdpConsentDate(LocalDateTime.now())
                .build();

        // Employer User
        User employer = User.builder()
                .name("Priya Nair")
                .email("recruiter@razorpay.com")
                .password(passwordEncoder.encode("recruiter123"))
                .role("ROLE_EMPLOYER")
                .phone("+919711223344")
                .headline("Talent Acquisition Lead @ Razorpay")
                .location("Bengaluru, India")
                .kycVerified(true)
                .kycToken("PAN-AAACR1234F")
                .dpdpConsentGiven(true)
                .dpdpConsentDate(LocalDateTime.now())
                .build();

        userRepository.saveAll(Arrays.asList(admin, candidate, employer));
        System.out.println("✅ DataInitializer: Seeded default users (admin@workverse.in, candidate@workverse.in, recruiter@razorpay.com)");
    }

    private void seedJobs() {
        if (jobRepository.count() > 0) return;

        List<Job> sampleJobs = Arrays.asList(
                Job.builder()
                        .title("Senior Frontend Engineer")
                        .company("Razorpay")
                        .location("Bengaluru, India")
                        .jobType(JobType.FULL_TIME)
                        .category("Engineering")
                        .salaryRange("₹22,00,000 - ₹35,00,000 INR")
                        .description("Build low-latency payment checkout experiences for over 8M merchants across India. Work with React 18, TypeScript, and micro-frontend architecture.")
                        .techStack(Arrays.asList("React", "TypeScript", "Redux", "Node.js", "Tailwind CSS"))
                        .build(),

                Job.builder()
                        .title("Product Manager — Growth & Retention")
                        .company("Swiggy")
                        .location("Bengaluru, India")
                        .jobType(JobType.FULL_TIME)
                        .category("Product & Data")
                        .salaryRange("₹28,00,000 - ₹42,00,000 INR")
                        .description("Lead product strategy and conversion rate optimization for Swiggy Instamart. Analyze user funnels, conduct A/B tests, and scale daily active users.")
                        .techStack(Arrays.asList("Product Strategy", "Mixpanel", "SQL", "A/B Testing", "Agile"))
                        .build(),

                Job.builder()
                        .title("Senior Investment Analyst")
                        .company("HDFC Securities")
                        .location("Mumbai, India")
                        .jobType(JobType.FULL_TIME)
                        .category("Finance & Banking")
                        .salaryRange("₹18,00,000 - ₹28,00,000 INR")
                        .description("Perform equity research, financial modeling, and risk assessments for institutional portfolios in Indian equity and capital markets.")
                        .techStack(Arrays.asList("Financial Modeling", "Equity Research", "Valuation", "Excel", "Bloomberg"))
                        .build(),

                Job.builder()
                        .title("Full Stack Developer (Next.js & Python)")
                        .company("Postman")
                        .location("Remote — India")
                        .jobType(JobType.REMOTE)
                        .category("Engineering")
                        .salaryRange("₹20,00,000 - ₹32,00,000 INR")
                        .description("Work on Postman's API collaboration platform used by 25M+ developers worldwide. Ship features across frontend and high-throughput backend services.")
                        .techStack(Arrays.asList("Next.js", "React", "Python", "FastAPI", "PostgreSQL"))
                        .build(),

                Job.builder()
                        .title("Senior Data Scientist (LLMs & Search)")
                        .company("Flipkart")
                        .location("Bengaluru, India")
                        .jobType(JobType.FULL_TIME)
                        .category("Product & Data")
                        .salaryRange("₹32,00,000 - ₹50,00,000 INR")
                        .description("Develop state-of-the-art recommendation models and LLM-powered search algorithms processing petabytes of e-commerce catalog data.")
                        .techStack(Arrays.asList("Python", "PyTorch", "Transformers", "Spark", "Vector DB"))
                        .build(),

                Job.builder()
                        .title("Lead Brand & Growth Marketing Manager")
                        .company("CRED")
                        .location("Bengaluru, India")
                        .jobType(JobType.HYBRID)
                        .category("Marketing & Sales")
                        .salaryRange("₹25,00,000 - ₹38,00,000 INR")
                        .description("Design and execute multi-channel performance marketing campaigns, influencer strategies, and viral growth initiatives for premium CRED members.")
                        .techStack(Arrays.asList("Performance Marketing", "SEO/SEM", "Brand Strategy", "Analytics"))
                        .build(),

                Job.builder()
                        .title("UI/UX Product Designer")
                        .company("Unacademy")
                        .location("Remote — India")
                        .jobType(JobType.REMOTE)
                        .category("Design & UX")
                        .salaryRange("₹15,00,000 - ₹24,00,000 INR")
                        .description("Create intuitive, accessible learning experiences for millions of students. Conduct user research, design wireframes, and craft polished UI components in Figma.")
                        .techStack(Arrays.asList("Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"))
                        .build(),

                Job.builder()
                        .title("Java Microservices Backend Developer")
                        .company("Goldman Sachs")
                        .location("Hyderabad, India")
                        .jobType(JobType.FULL_TIME)
                        .category("Engineering")
                        .salaryRange("₹24,00,000 - ₹36,00,000 INR")
                        .description("Build low-latency trading engines and risk management services using Spring Boot 3 and Java 21. Optimize DB queries and event-driven Kafka pipelines.")
                        .techStack(Arrays.asList("Java 21", "Spring Boot", "Kafka", "PostgreSQL", "Docker"))
                        .build()
        );

        jobRepository.saveAll(sampleJobs);
        System.out.println("✅ DataInitializer: Successfully populated H2 Database with " + sampleJobs.size() + " Indian tech job postings.");
    }

    private void seedCompanies() {
        if (companyRepository.count() > 0) return;

        List<Company> sampleCompanies = Arrays.asList(
                Company.builder()
                        .name("Razorpay")
                        .industry("Fintech / Payments")
                        .location("Bengaluru, India")
                        .companySize(CompanySize.ENTERPRISE)
                        .rating(4.8)
                        .reviewCount(1420)
                        .description("India's leading full-stack financial services platform powering payments for over 8 million businesses.")
                        .logoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80")
                        .websiteUrl("https://razorpay.com")
                        .techStack(Arrays.asList("React", "TypeScript", "Go", "PHP", "AWS"))
                        .fundingStage("Unicorn ($370M Series F)")
                        .isVerified(true)
                        .build(),

                Company.builder()
                        .name("Swiggy")
                        .industry("Consumer Tech / Quick Commerce")
                        .location("Bengaluru, India")
                        .companySize(CompanySize.ENTERPRISE)
                        .rating(4.6)
                        .reviewCount(980)
                        .description("Hyperlocal food delivery and quick commerce leader connecting 50M+ users across 500+ Indian cities.")
                        .logoUrl("https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80")
                        .websiteUrl("https://swiggy.com")
                        .techStack(Arrays.asList("Java", "Go", "React Native", "Kafka", "Redis"))
                        .fundingStage("Public (NSE/BSE Listed)")
                        .isVerified(true)
                        .build(),

                Company.builder()
                        .name("CRED")
                        .industry("Fintech / Premium Rewards")
                        .location("Bengaluru, India")
                        .companySize(CompanySize.MID)
                        .rating(4.8)
                        .reviewCount(610)
                        .description("Members-only credit card bill payment platform rewarding high-trust individuals in India.")
                        .logoUrl("https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80")
                        .websiteUrl("https://cred.club")
                        .techStack(Arrays.asList("Flutter", "Kotlin", "Spring Boot", "AWS", "Figma"))
                        .fundingStage("Unicorn ($140M Series F)")
                        .isVerified(true)
                        .build(),

                Company.builder()
                        .name("Postman")
                        .industry("Developer Tools / SaaS")
                        .location("Remote — India")
                        .companySize(CompanySize.MID)
                        .rating(4.9)
                        .reviewCount(430)
                        .description("The world's leading API platform used by over 25 million developers and 98% of Fortune 500 companies.")
                        .logoUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80")
                        .websiteUrl("https://postman.com")
                        .techStack(Arrays.asList("Next.js", "Node.js", "Python", "GraphQL", "PostgreSQL"))
                        .fundingStage("Unicorn ($225M Series D)")
                        .isVerified(true)
                        .build()
        );

        companyRepository.saveAll(sampleCompanies);
        System.out.println("✅ DataInitializer: Seeded " + sampleCompanies.size() + " companies.");
    }

    private void seedSalaryData() {
        if (salaryDataRepository.count() > 0) return;

        List<SalaryData> sampleSalaries = Arrays.asList(
                SalaryData.builder().role("Software Engineer").location("Bengaluru, India").experienceLevel("0-2 Years (Entry Level)").salaryMin(800000L).salaryMax(1600000L).sampleSize(450).build(),
                SalaryData.builder().role("Software Engineer").location("Bengaluru, India").experienceLevel("3-5 Years (Mid Level)").salaryMin(1800000L).salaryMax(3200000L).sampleSize(820).build(),
                SalaryData.builder().role("Software Engineer").location("Bengaluru, India").experienceLevel("6-10 Years (Senior / Lead)").salaryMin(3200000L).salaryMax(5500000L).sampleSize(610).build(),
                SalaryData.builder().role("Product Manager").location("Bengaluru, India").experienceLevel("3-5 Years (Mid Level)").salaryMin(2200000L).salaryMax(3800000L).sampleSize(340).build(),
                SalaryData.builder().role("Data Scientist").location("Bengaluru, India").experienceLevel("3-5 Years (Mid Level)").salaryMin(2000000L).salaryMax(3500000L).sampleSize(290).build(),
                SalaryData.builder().role("UI/UX Designer").location("Remote — India").experienceLevel("2-5 Years (Mid Level)").salaryMin(1200000L).salaryMax(2200000L).sampleSize(180).build(),
                SalaryData.builder().role("DevOps / SRE Engineer").location("Hyderabad, India").experienceLevel("4-7 Years (Senior Level)").salaryMin(2400000L).salaryMax(4000000L).sampleSize(230).build()
        );

        salaryDataRepository.saveAll(sampleSalaries);
        System.out.println("✅ DataInitializer: Seeded " + sampleSalaries.size() + " salary guide entries.");
    }
}

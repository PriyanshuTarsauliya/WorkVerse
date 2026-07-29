# Multi-stage Dockerfile for Spring Boot 3 Java 17 Application

# Stage 1: Build JAR package using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java Runtime environment for execution
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
EXPOSE 8080

# Copy compiled JAR artifact from Stage 1
COPY --from=builder /app/target/*.jar app.jar

# Create a non-root user and group
RUN addgroup -S spring && adduser -S spring -G spring
RUN chown spring:spring app.jar
USER spring:spring

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]

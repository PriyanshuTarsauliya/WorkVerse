package com.techjobs.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techjobs.backend.dto.LoginRequest;
import com.techjobs.backend.dto.SignupRequest;
import com.techjobs.backend.entity.User;
import com.techjobs.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("TEST 1: Register User — Happy Path")
    void testRegisterUser_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setName("QA Test User");
        signupRequest.setEmail("qa.user@example.com");
        signupRequest.setPassword("Password123");
        signupRequest.setRole("seeker");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("User registered successfully!")));

        assertTrue(userRepository.findByEmail("qa.user@example.com").isPresent());
        User savedUser = userRepository.findByEmail("qa.user@example.com").get();
        assertEquals("QA Test User", savedUser.getName());
        assertEquals("ROLE_SEEKER", savedUser.getRole());
        assertTrue(passwordEncoder.matches("Password123", savedUser.getPassword()));
    }

    @Test
    @DisplayName("TEST 2: Register User — Duplicate Email Edge Case")
    void testRegisterUser_DuplicateEmail_Fails() throws Exception {
        // Pre-register user
        User existingUser = User.builder()
                .name("Existing Candidate")
                .email("existing@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role("ROLE_USER")
                .build();
        userRepository.save(existingUser);

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setName("Duplicate Candidate");
        signupRequest.setEmail("existing@example.com");
        signupRequest.setPassword("Password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Error: Email is already in use!")));
    }

    @Test
    @DisplayName("TEST 3: Authenticate User — Happy Path (Login & JWT Generation)")
    void testAuthenticateUser_Success() throws Exception {
        User user = User.builder()
                .name("Alex Morgan")
                .email("alex.morgan@example.com")
                .password(passwordEncoder.encode("SecretPass123"))
                .role("ROLE_USER")
                .build();
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alex.morgan@example.com");
        loginRequest.setPassword("SecretPass123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.email", is("alex.morgan@example.com")))
                .andExpect(jsonPath("$.name", is("Alex Morgan")))
                .andExpect(jsonPath("$.role", is("ROLE_USER")));
    }

    @Test
    @DisplayName("TEST 4: Authenticate User — Wrong Password Edge Case")
    void testAuthenticateUser_InvalidPassword_Fails() throws Exception {
        User user = User.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .password(passwordEncoder.encode("CorrectPassword"))
                .role("ROLE_USER")
                .build();
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("WrongPassword999");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TEST 5: Authenticate User — Non-Existent Account Edge Case")
    void testAuthenticateUser_UnregisteredUser_Fails() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("Password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}

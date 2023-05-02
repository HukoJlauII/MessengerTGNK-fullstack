package com.example.messengertgnk.controller;

import com.example.messengertgnk.dto.CredentialsDto;
import com.example.messengertgnk.dto.UserRegisterDto;
import com.example.messengertgnk.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource("/application-test.properties")
@AutoConfigureMockMvc
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private UserService userService;


    private static final ObjectMapper mapper = new ObjectMapper();

    @Test
    @Sql(value = {"/delete-test-users.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void registerUserSuccess() throws Exception {
        UserRegisterDto userRegisterDto = UserRegisterDto.builder()
                .username("testUser")
                .name("username")
                .surname("usersurname")
                .email("testemail@mail.ru")
                .password("12345678")
                .passwordConfirm("12345678")
                .build();
        String body = mapper.writeValueAsString(userRegisterDto);
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());
    }

    @Nested
    class InnerTest {
        @Test
        void registerUserBadFields() throws Exception {
            UserRegisterDto userRegisterDto = UserRegisterDto.builder()
                    .username("test")
                    .name("")
                    .surname("")
                    .email("testemail")
                    .password("123")
                    .passwordConfirm("123")
                    .build();
            String body = mapper.writeValueAsString(userRegisterDto);
            mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andDo(print())
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.[*].defaultMessage").exists());
        }

        @Test
        void registerUserAlreadyExists() throws Exception {
            UserRegisterDto userRegisterDto = UserRegisterDto.builder()
                    .username("testUser")
                    .name("username")
                    .surname("usersurname")
                    .email("testmail@gmail.com")
                    .password("12345678")
                    .passwordConfirm("12345678")
                    .build();
            String body = mapper.writeValueAsString(userRegisterDto);
            mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andDo(print())
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.[0].defaultMessage").isString());
        }

        @Test
        void loginUserSuccess() throws Exception {
            CredentialsDto credentialsDto = CredentialsDto.builder()
                    .username("testUser")
                    .password("12345678")
                    .build();
            String credentials = mapper.writeValueAsString(credentialsDto);
            mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(credentials))
                    .andDo(print())
                    .andExpect(status().is2xxSuccessful())
                    .andExpect(jsonPath("$.user").isMap())
                    .andExpect(jsonPath("$.token").isString());
        }

        @Test
        void loginUserWithBadCredentials() throws Exception {
            CredentialsDto credentialsDto = CredentialsDto.builder()
                    .username("testUser")
                    .password("123456")
                    .build();
            String credentials = mapper.writeValueAsString(credentialsDto);
            mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(credentials))
                    .andDo(print())
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithUserDetails(value = "testUser", userDetailsServiceBeanName = "userService", setupBefore = TestExecutionEvent.TEST_EXECUTION)
        void getUserInfoSuccess() throws Exception {
            mockMvc.perform(get("/api/auth/info").contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("testUser"))
                    .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));
        }


        @Test
        void getUserInfoUnauthorized() throws Exception {
            mockMvc.perform(get("/api/auth/info").contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isUnauthorized());
        }
    }
}
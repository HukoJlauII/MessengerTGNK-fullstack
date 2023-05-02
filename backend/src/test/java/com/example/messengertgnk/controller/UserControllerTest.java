package com.example.messengertgnk.controller;

import com.example.messengertgnk.dto.ChangePasswordDto;
import com.example.messengertgnk.dto.ChangeUserDto;
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
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource("/application-test.properties")
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private UserService userService;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Test
    void changePasswordUnauthorized() throws Exception {
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .password("12345678")
                .newPassword("87654321")
                .newPasswordConfirm("87654321")
                .build();
        String body = mapper.writeValueAsString(changePasswordDto);
        mockMvc.perform(put("/api/profile/changePassword").contentType(MediaType.APPLICATION_JSON).content(body))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }


    @Test
    @WithUserDetails(value = "testUser", userDetailsServiceBeanName = "userService", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void changePasswordBadCredentials() throws Exception {
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .password("1234567")
                .newPassword("87654321")
                .newPasswordConfirm("87654321")
                .build();
        String body = mapper.writeValueAsString(changePasswordDto);
        mockMvc.perform(put("/api/profile/changePassword").contentType(MediaType.APPLICATION_JSON).content(body))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.[*].defaultMessage").exists());
    }




    @Test
    void changeUserInfoUnauthorized() throws Exception {
        ChangeUserDto changeUserDto = ChangeUserDto.builder()
                .username("")
                .email("")
                .name("")
                .surname("")
                .build();
        String body = mapper.writeValueAsString(changeUserDto);
        mockMvc.perform(put("/api/profile/changeInfo").contentType(MediaType.APPLICATION_JSON).param("user", body))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }


    @Test
    @WithUserDetails(value = "testUser", userDetailsServiceBeanName = "userService", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void changeUserInfoBadCredentials() throws Exception {
        ChangeUserDto changeUserDto = ChangeUserDto.builder()
                .username("")
                .email("")
                .name("")
                .surname("")
                .build();
        String body = mapper.writeValueAsString(changeUserDto);
        mockMvc.perform(put("/api/profile/changeInfo").contentType(MediaType.APPLICATION_JSON).param("user", body))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.[*].defaultMessage").exists());
    }

    @Nested
    class changeSuccess {
        @Test
        @WithUserDetails(value = "testUser", userDetailsServiceBeanName = "userService", setupBefore = TestExecutionEvent.TEST_EXECUTION)
        void changePasswordSuccess() throws Exception {
            ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                    .password("12345678")
                    .newPassword("87654321")
                    .newPasswordConfirm("87654321")
                    .build();
            String body = mapper.writeValueAsString(changePasswordDto);
            mockMvc.perform(put("/api/profile/changePassword").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("testUser"));
        }
        @Test
        @WithUserDetails(value = "testUser", userDetailsServiceBeanName = "userService", setupBefore = TestExecutionEvent.TEST_EXECUTION)
        void changeUserInfoSuccess() throws Exception {
            ChangeUserDto changeUserDto = ChangeUserDto.builder()
                    .username("changedTestUser")
                    .name("username")
                    .surname("usersurname")
                    .email("testmail@gmail.com")
                    .build();
            String body = mapper.writeValueAsString(changeUserDto);
            mockMvc.perform(put("/api/profile/changeInfo").contentType(MediaType.APPLICATION_JSON).param("user", body))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("changedTestUser"));
        }
    }

}
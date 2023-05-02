package com.example.messengertgnk.controller;

import com.example.messengertgnk.service.MessageService;
import com.example.messengertgnk.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource("/application-test.properties")
@AutoConfigureMockMvc
class MessageControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private MessageService messageService;

    @InjectMocks
    private UserService userService;

    @Test
    void showAllUserDialogsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/user/dialogs"))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithUserDetails(value = "testUser",userDetailsServiceBeanName = "userService",setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void showAllUserDialogsSuccess() throws Exception {
        mockMvc.perform(get("/api/user/dialogs"))
                .andDo(print())
                .andExpect(status().isOk());
    }

}
package com.example.messengertgnk.service;

import com.example.messengertgnk.entity.Role;
import com.example.messengertgnk.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;

@Service
public class AdminInitService implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userService.existsByUsername("Admin")) {
            User user = User.builder()
                    .username("Admin")
                    .email("nikpuk637@gmail.com")
                    .name("Admin")
                    .surname("Admin")
                    .password(passwordEncoder.encode("adminpass"))
                    .roles(Set.of(Role.ROLE_ADMIN))
                    .registrationDate(LocalDate.now())
                    .build();
            userService.save(user);
        }
    }
}

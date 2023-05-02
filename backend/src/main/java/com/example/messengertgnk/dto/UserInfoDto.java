package com.example.messengertgnk.dto;

import com.example.messengertgnk.entity.Media;
import com.example.messengertgnk.entity.Role;
import com.example.messengertgnk.entity.User;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * A DTO for the {@link User} entity
 */
@Data
@Builder
public class UserInfoDto implements Serializable {

    private Long id;

    private final String username;
    private final Set<Role> roles;
    private final String email;
    private String name;
    private String surname;
    private LocalDate registrationDate;
    private Media avatar;
    private LocalDateTime lastOnline;
}
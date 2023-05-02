package com.example.messengertgnk.service;

import com.example.messengertgnk.configuration.JWT.JWTUtil;
import com.example.messengertgnk.dto.*;
import com.example.messengertgnk.entity.Media;
import com.example.messengertgnk.entity.Role;
import com.example.messengertgnk.entity.User;
import com.example.messengertgnk.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.Validator;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


@Service
@Transactional
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private Validator validator;

    public User save(User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username).orElse(null);
    }

    public User findUserBySessionId(String sessionId) {
        return userRepository.findUserBySessionId(sessionId).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public UserInfoDto mapToInfoDto(User user) {
        return UserInfoDto.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .registrationDate(user.getRegistrationDate())
                .avatar(user.getAvatar())
                .build();
    }


    public User getUserAuth(Authentication authentication) {
        return (User) loadUserByUsername(authentication.getName());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException("No user with username = " + username));
    }

    public ResponseEntity<?> validateRegister(UserRegisterDto userRegisterDto, BindingResult bindingResult) {
        if (!userRegisterDto.getPassword().equals(userRegisterDto.getPasswordConfirm())) {
            bindingResult.addError(new FieldError("user", "passwordConfirm", "Пароли не совпадают"));
        }
        if (existsByUsername(userRegisterDto.getUsername())) {
            bindingResult.addError(new FieldError("user", "username", "Пользователь с таким никнеймом уже существует"));
        }
        if (existsByEmail(userRegisterDto.getEmail())) {
            bindingResult.addError(new FieldError("user", "email", "Пользователь с такой почтой уже существует"));
        }
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        } else {
            registerUser(userRegisterDto);
            String token = jwtUtil.generateToken(userRegisterDto.getUsername());
            return new ResponseEntity<>(Collections.singletonMap("token", token), HttpStatus.ACCEPTED);
        }
    }

    public void registerUser(UserRegisterDto userRegisterDto) {
        User user = User.builder()
                .name(userRegisterDto.getName())
                .surname(userRegisterDto.getSurname())
                .username(userRegisterDto.getUsername())
                .email(userRegisterDto.getEmail())
                .roles(Set.of(Role.ROLE_USER))
                .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                .registrationDate(LocalDate.now())
                .lastOnline(LocalDateTime.now())
                .build();
        save(user);
    }

    public ResponseEntity<?> loginUser(CredentialsDto credentialsDto) {

        UsernamePasswordAuthenticationToken authInputToken =
                new UsernamePasswordAuthenticationToken(credentialsDto.getUsername(), credentialsDto.getPassword());
        authenticationManager.authenticate(authInputToken);
        Map<String, Object> map = new HashMap<>();
        String token = jwtUtil.generateToken(credentialsDto.getUsername());
        map.put("token", token);
        User user = findUserByUsername(credentialsDto.getUsername());
        save(user);
        UserInfoDto userInfo = mapToInfoDto(user);
        map.put("user", userInfo);
        return new ResponseEntity<>(map, HttpStatus.ACCEPTED);

    }


    public ResponseEntity<?> showUserInfo(Authentication authentication) {
        User user = getUserAuth(authentication);
        UserInfoDto userInfo = mapToInfoDto(user);
        return ResponseEntity.ok(userInfo);
    }

    public ResponseEntity<?> changeUserPassword(ChangePasswordDto changePasswordDto, BindingResult bindingResult, Authentication authentication) {
        User user = getUserAuth(authentication);

        if (!passwordEncoder.matches(changePasswordDto.getPassword(), user.getPassword())) {
            bindingResult.addError(new FieldError("user", "password", "Старый пароль неверный"));
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getNewPasswordConfirm())) {
            bindingResult.addError(new FieldError("user", "newPasswordConfirm", "Пароли не совпадают"));
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok(mapToInfoDto(user));
    }

    public ResponseEntity<?> changeUserInfo(Authentication authentication, MultipartFile multipartFile, String changeUserInfo) throws IOException {
        User user = getUserAuth(authentication);
        ChangeUserDto changeUserDto = new ObjectMapper().readValue(changeUserInfo, ChangeUserDto.class);
        SpringValidatorAdapter springValidator = new SpringValidatorAdapter(validator);
        BindingResult bindingResult = new BeanPropertyBindingResult(changeUserDto, "changeUserDtoResult");
        springValidator.validate(changeUserDto, bindingResult);
        if (!changeUserDto.getEmail().equals(user.getEmail()) && existsByEmail(changeUserDto.getEmail())) {
            bindingResult.addError(new FieldError("user", "email", "Пользователь с такой почтой уже существует"));
        }
        if (!changeUserDto.getUsername().equals(user.getUsername()) && existsByUsername(changeUserDto.getUsername())) {
            bindingResult.addError(new FieldError("user", "username", "Пользователь с таким именем уже существует"));
        }
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }
        if (!changeUserDto.getUsername().equals(user.getUsername())) {
            user.setUsername(changeUserDto.getUsername());
            authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        user.setName(changeUserDto.getName());
        user.setSurname(changeUserDto.getSurname());
        user.setEmail(changeUserDto.getEmail());
        if (multipartFile != null) {
            Media media = Media.builder()
                    .originalFileName(multipartFile.getOriginalFilename())
                    .mediaType(multipartFile.getContentType())
                    .size(multipartFile.getSize())
                    .bytes(multipartFile.getBytes()).build();
            user.setAvatar(media);
        }
        save(user);
        return new ResponseEntity<>(mapToInfoDto(user), HttpStatus.OK);
    }


}

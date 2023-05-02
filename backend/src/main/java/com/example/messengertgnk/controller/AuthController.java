package com.example.messengertgnk.controller;

import com.example.messengertgnk.dto.CredentialsDto;
import com.example.messengertgnk.dto.UserRegisterDto;
import com.example.messengertgnk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }
        return userService.validateRegister(userRegisterDto, bindingResult);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody CredentialsDto credentialsDto) {
        return userService.loginUser(credentialsDto);
    }


    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        return userService.showUserInfo(authentication);
    }
}

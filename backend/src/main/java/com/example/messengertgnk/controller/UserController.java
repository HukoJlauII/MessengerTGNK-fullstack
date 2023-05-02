package com.example.messengertgnk.controller;

import com.example.messengertgnk.dto.ChangePasswordDto;
import com.example.messengertgnk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private UserService userService;


    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult bindingResult, Authentication authentication) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldErrors(), HttpStatus.CONFLICT);
        }
        return userService.changeUserPassword(changePasswordDto, bindingResult, authentication);

    }

    @PutMapping("/changeInfo")
    public ResponseEntity<?> changeUserInfo(Authentication authentication, @RequestParam(value = "file", required = false) MultipartFile multipartFile, @RequestParam(value = "user", required = false) String changeUserInfo) throws IOException {
        return userService.changeUserInfo(authentication, multipartFile, changeUserInfo);
    }
}

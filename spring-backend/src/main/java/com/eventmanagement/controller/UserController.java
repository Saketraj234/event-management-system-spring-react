package com.eventmanagement.controller;

import com.eventmanagement.entity.User;
import com.eventmanagement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return ResponseEntity.ok(savedUser);
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {

        String token = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        return ResponseEntity.ok(token);
    }
}
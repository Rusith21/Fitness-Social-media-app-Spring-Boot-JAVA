package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) throws Exception {
        try {
            User savedUser = userService.signupUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Signup failed: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<?> getFollowersCount(@PathVariable String userId) {
        try {
            int followersCount = userService.getFollowersCount(userId);
            return ResponseEntity.ok(followersCount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting followers count: " + e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signInUser(@RequestBody User user) {
        try {
            User authenticatedUser = userService.signInUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(authenticatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sign-in failed: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/follow/{followUserId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @PathVariable String followUserId) {
        try {
            User user = userService.followUser(userId, followUserId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error following user: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/unfollow/{unfollowUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String unfollowUserId) {
        try {
            User user = userService.unfollowUser(userId, unfollowUserId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error unfollowing user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.model.Comment;
import com.example.backend.model.User;
import com.example.backend.model.WorkoutUpdate;
import com.example.backend.service.UserService;
import com.example.backend.service.WorkoutUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/workout-updates")
public class WorkoutUpdateController {
    @Autowired
    private WorkoutUpdateService service;
    @Autowired
    private UserService userManagementService;
    @Autowired
    private Cloudinary cloudinary;

    @GetMapping
    public ResponseEntity<List<WorkoutUpdate>> getAllUpdates() {
        List<WorkoutUpdate> updates = service.getAllUpdates();
        if (updates.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content if there are no updates
        }
        return ResponseEntity.ok(updates); // 200 OK with list of updates
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutUpdate>> getUpdatesByUserId(@PathVariable String userId) {
        List<WorkoutUpdate> updates = service.getUpdatesByUserId(userId);
        if (updates.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(updates);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> addLike(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId"); // Extract user ID from request body
        return service.getUpdateById(id)
                .map(update -> {
                    // Check if the user ID is already in the list of likes
                    if (!update.getLikes().contains(userId)) {
                        // Add the user ID to the list of likes
                        update.getLikes().add(userId);
                        // Save the updated workout update
                        service.saveUpdate(update);
                        return ResponseEntity.ok(update);
                    } else {
                        // Return a response indicating that the user has already liked the workout update
                        return ResponseEntity.badRequest().body("User has already liked the workout update.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Comment comment) {
        // Generate a UUID for the comment ID
        String commentId = UUID.randomUUID().toString();
        comment.setId(commentId);

        // Ensure that the comment has a user ID
        if (comment.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required for adding a comment.");
        }

        Optional<User> userOptional = userManagementService.findUserById(comment.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Set the user's name in the comment
            comment.setUserName(user.getName());
            // Set the comment ID
            comment.setCommentId(commentId);
        } else {
            // Handle the case where the user with the given ID is not found
            return ResponseEntity.badRequest().body("User with ID " + comment.getUserId() + " not found.");
        }

        return service.getUpdateById(id)
                .map(update -> {
                    update.addComment(comment);
                    service.saveUpdate(update);
                    return ResponseEntity.ok(update);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutUpdate> getUpdateById(@PathVariable String id) {
        return service.getUpdateById(id)
                .map(ResponseEntity::ok) // 200 OK with the workout update
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found if not present
    }

    @PostMapping
    public ResponseEntity<?> createUpdate(@RequestParam(value = "imageFiles", required = false) List<MultipartFile> imageFiles,
                                          @RequestParam("title") String title,
                                          @RequestParam("description") String description,
                                          @RequestParam("distance") double distance,
                                          @RequestParam("pushups") int pushups,
                                          @RequestParam("weightLifted") double weightLifted,
                                          @RequestParam("userId") String userId) {
        try {
            // Upload workout update images to Cloudinary
            List<String> imageUrls = new ArrayList<>();
            if (imageFiles != null && !imageFiles.isEmpty()) {
                for (MultipartFile file : imageFiles) {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = (String) uploadResult.get("url");
                    imageUrls.add(imageUrl);
                }
            }

            // Create workout update object
            WorkoutUpdate update = new WorkoutUpdate();
            update.setTitle(title);
            update.setDescription(description);
            update.setUserId(userId);
            update.setDistance(distance);
            update.setPushups(pushups);
            update.setWeightLifted(weightLifted);
            update.setImageUrls(imageUrls);

            // Fetch the user's name from the database based on the user id
            Optional<User> userOptional = userManagementService.findUserById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Set the user's name in the workout update
                update.setUserName(user.getName());
            }

            // Save the workout update
            WorkoutUpdate createdUpdate = service.saveUpdate(update);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUpdate);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

    @DeleteMapping("/{workoutUpdateId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String workoutUpdateId, @PathVariable String commentId) {
        return service.getUpdateById(workoutUpdateId)
                .map(workoutUpdate -> {
                    boolean removed = workoutUpdate.getComments().removeIf(comment -> comment.getId().equals(commentId));
                    if (removed) {
                        service.saveUpdate(workoutUpdate);
                        return ResponseEntity.ok().build();
                    } else {
                        return ResponseEntity.badRequest().body("Comment not found or already deleted.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{workoutUpdateId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String workoutUpdateId, @PathVariable String commentId, @RequestBody Comment updatedComment) {
        return service.getUpdateById(workoutUpdateId)
                .map(workoutUpdate -> workoutUpdate.updateComment(commentId, updatedComment)
                        .map(comment -> {
                            service.saveUpdate(workoutUpdate);  // Save the updated meal plan
                            return ResponseEntity.ok(comment);
                        })
                        .orElseGet(() -> ResponseEntity.notFound().build()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutUpdate> updateUpdate(@PathVariable String id, @RequestBody WorkoutUpdate update) {
        return service.updateWorkoutUpdate(id, update)
                .map(updatedUpdate -> ResponseEntity.ok(updatedUpdate)) // 200 OK with the updated update
                .orElseGet(() -> ResponseEntity.notFound().build()); // 404 Not Found if the update does not exist
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUpdate(@PathVariable String id) {
        if (!service.deleteUpdate(id)) {
            return ResponseEntity.notFound().build(); // 404 Not Found if the update does not exist
        }
        return ResponseEntity.ok().build(); // 200 OK on successful deletion
    }
}
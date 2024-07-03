package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.model.Comment;
import com.example.backend.model.User;
import com.example.backend.model.WorkoutPlan;
import com.example.backend.service.UserService;
import com.example.backend.service.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/workout-plans")
public class WorkoutPlanController {
    @Autowired
    private WorkoutPlanService service;
    @Autowired
    private UserService userManagementService;
    @Autowired
    private Cloudinary cloudinary;

    @GetMapping
    public ResponseEntity<List<WorkoutPlan>> getAllPlans() {
        List<WorkoutPlan> plans = service.getAllPlans();
        if (plans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutPlan>> getPlansByUserId(@PathVariable String userId) {
        List<WorkoutPlan> plans = service.getPlansByUserId(userId);
        if (plans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(plans);
    }

    @PostMapping("/{workoutPlanId}/like")
    public ResponseEntity<?> addLike(@PathVariable String workoutPlanId, @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId"); // Extract user ID from request body
        return service.getPlanById(workoutPlanId)
                .map(workoutPlan -> {
                    // Check if the user ID is already in the list of likes
                    if (!workoutPlan.getLikes().contains(userId)) {
                        // Add the user ID to the list of likes
                        workoutPlan.getLikes().add(userId);
                        // Save the updated workout plan
                        service.savePlan(workoutPlan);
                        return ResponseEntity.ok(workoutPlan);
                    } else {
                        // Return a response indicating that the user has already liked the workout plan
                        return ResponseEntity.badRequest().body("User has already liked the workout plan.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{workoutPlanId}/comment")
    public ResponseEntity<?> addComment(@PathVariable String workoutPlanId, @RequestBody Comment comment) {
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

        return service.getPlanById(workoutPlanId)
                .map(workoutPlan -> {
                    workoutPlan.addComment(comment);
                    service.savePlan(workoutPlan);
                    return ResponseEntity.ok(workoutPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getPlanById(@PathVariable String id) {
        return service.getPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestParam(value = "imageFiles", required = false) List<MultipartFile> imageFiles,
                                        @RequestParam("title") String title,
                                        @RequestParam("description") String description,
                                        @RequestParam("exercises") List<String> exercises,
                                        @RequestParam("routines") List<String> routines,
                                        @RequestParam("sets") List<String> sets,
                                        @RequestParam("repetitions") List<String> repetitions,
                                        @RequestParam("userId") String userId) {
        try {
            // Upload workout plan images to Cloudinary
            List<String> imageUrls = new ArrayList<>();
            if (imageFiles != null && !imageFiles.isEmpty()) {
                for (MultipartFile file : imageFiles) {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = (String) uploadResult.get("url");
                    imageUrls.add(imageUrl);
                }
            }

            // Create workout plan object
            WorkoutPlan plan = new WorkoutPlan();
            plan.setTitle(title);
            plan.setDescription(description);
            plan.setExercises(exercises);
            plan.setRoutines(routines);
            plan.setSets(sets);
            plan.setRepetitions(repetitions);
            plan.setImageUrls(imageUrls);
            plan.setUserId(userId);
            plan.setImageUrls(imageUrls);

            // Fetch the user's name from the database based on the user id
            Optional<User> userOptional = userManagementService.findUserById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Set the user's name in the workout plan
                plan.setUserName(user.getName());
            }

            // Save the workout plan
            WorkoutPlan savedPlan = service.savePlan(plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

    @PutMapping("/{workoutPlanId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String workoutPlanId, @PathVariable String commentId, @RequestBody Comment updatedComment) {
        return service.getPlanById(workoutPlanId)
                .map(workoutPlan -> workoutPlan.updateComment(commentId, updatedComment)
                        .map(comment -> {
                            service.savePlan(workoutPlan);  // Save the updated meal plan
                            return ResponseEntity.ok(comment);
                        })
                        .orElseGet(() -> ResponseEntity.notFound().build()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{workoutPlanId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String workoutPlanId, @PathVariable String commentId) {
        return service.getPlanById(workoutPlanId)
                .map(workoutPlan -> {
                    boolean removed = workoutPlan.getComments().removeIf(comment -> comment.getId().equals(commentId));
                    if (removed) {
                        service.savePlan(workoutPlan);
                        return ResponseEntity.ok().build();
                    } else {
                        return ResponseEntity.badRequest().body("Comment not found or already deleted.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlan> updatePlan(@PathVariable String id, @RequestBody WorkoutPlan plan) {
        return service.updatePlan(id, plan)
                .map(updatedPlan -> ResponseEntity.ok(updatedPlan))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        if (service.deletePlan(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
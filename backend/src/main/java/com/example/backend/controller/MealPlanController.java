package com.example.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.model.Comment;
import com.example.backend.model.MealPlan;
import com.example.backend.model.User;
import com.example.backend.service.MealPlanService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/meal-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class MealPlanController {
    @Autowired
    private MealPlanService service;
    @Autowired
    private UserService userManagementService;
    @Autowired
    private Cloudinary cloudinary;

    public MealPlanController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @GetMapping
    public ResponseEntity<List<MealPlan>> getAllMealPlans() {
        List<MealPlan> mealPlans = service.getAllMealPlans();
        if (mealPlans.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mealPlans, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealPlan>> getMealPlansByUserId(@PathVariable String userId) {
        List<MealPlan> mealPlans = service.getMealPlansByUserId(userId);
        if (mealPlans.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mealPlans, HttpStatus.OK);
    }

    @PutMapping("/{mealPlanId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String mealPlanId, @PathVariable String commentId, @RequestBody Comment updatedComment) {
        return service.getMealPlanById(mealPlanId)
                .map(mealPlan -> mealPlan.updateComment(commentId, updatedComment)
                        .map(comment -> {
                            service.saveMealPlan(mealPlan);  // Save the updated meal plan
                            return ResponseEntity.ok(comment);
                        })
                        .orElseGet(() -> ResponseEntity.notFound().build()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlan> getMealPlanById(@PathVariable String id) {
        return service.getMealPlanById(id)
                .map(mealPlan -> new ResponseEntity<>(mealPlan, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/{mealPlanId}/like")
    public ResponseEntity<?> addLike(@PathVariable String mealPlanId, @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        return service.getMealPlanById(mealPlanId)
                .map(mealPlan -> {
                    // Check if the user ID is already in the list of likes
                    if (!mealPlan.getLikes().contains(userId)) {
                        // Add the user ID to the list of likes
                        mealPlan.getLikes().add(userId);
                        // Save the updated meal plan
                        service.saveMealPlan(mealPlan);
                        return ResponseEntity.ok(mealPlan);
                    } else {
                        // Return a response indicating that the user has already liked the meal plan
                        return ResponseEntity.badRequest().body("User has already liked the meal plan.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{mealPlanId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String mealPlanId, @PathVariable String commentId) {
        boolean isDeleted = service.deleteComment(mealPlanId, commentId);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{mealPlanId}/comment")
    public ResponseEntity<?> addComment(@PathVariable String mealPlanId, @RequestBody Comment comment) {
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
            // Set the meal plan ID in the comment
            comment.setCommentId(commentId); // Assuming commentId should be set to id
        } else {
            // Handle the case where the user with the given ID is not found
            return ResponseEntity.badRequest().body("User with ID " + comment.getUserId() + " not found.");
        }

        return service.getMealPlanById(mealPlanId)
                .map(mealPlan -> {
                    mealPlan.addComment(comment);
                    service.saveMealPlan(mealPlan);
                    return ResponseEntity.ok(mealPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMealPlan(@RequestParam(value = "imageFiles", required = false) List<MultipartFile> imageFiles,
                                            @RequestParam("title") String title,
                                            @RequestParam("description") String description,
                                            @RequestParam("ingredients") List<String> ingredients,
                                            @RequestParam("instructions") List<String> instructions,
                                            @RequestParam("userName") List<String> userName,
                                            @RequestParam("dietaryPreference") String dietaryPreference,
                                            @RequestParam("nutritionalInfo") List<String> nutritionalInfo,
                                            @RequestParam("portionSizes") List<String>  portionSizes,
                                            @RequestParam("userId") String userId) {

        try {
            // Upload meal plan images to Cloudinary
            List<String> imageUrls = new ArrayList<>();
            if (imageFiles != null && !imageFiles.isEmpty()) {
                for (MultipartFile file : imageFiles) {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = (String) uploadResult.get("url");
                    imageUrls.add(imageUrl);
                }
            }

            // Create meal plan object
            MealPlan mealPlan = new MealPlan();
            mealPlan.setTitle(title);
            mealPlan.setDescription(description);
            mealPlan.setIngredients(ingredients);
            mealPlan.setInstructions(instructions);
            mealPlan.setDietaryPreference(dietaryPreference);
            mealPlan.setNutritionalInfo(nutritionalInfo);
            mealPlan.setPortionSizes(portionSizes);
            mealPlan.setUserId(userId);
            mealPlan.setImageUrls(imageUrls);

            Optional<User> userOptional = userManagementService.findUserById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Set the user's name in the workout plan
                mealPlan.setUserName(user.getName());
            }

            // Save meal plan to the database
            MealPlan savedMealPlan = service.saveMealPlan(mealPlan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMealPlan);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

        @PutMapping("/{id}")
    public ResponseEntity<MealPlan> updateMealPlan(@PathVariable String id, @RequestBody MealPlan mealPlan) {
        MealPlan updatedMealPlan = service.updateMealPlan(id, mealPlan);
        if (updatedMealPlan == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedMealPlan, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable String id) {
        boolean isDeleted = service.deleteMealPlan(id);
        if (!isDeleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
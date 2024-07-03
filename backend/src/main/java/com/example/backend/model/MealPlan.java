package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "meal_plans")
public class MealPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private List<String> imageUrls;
    private List<String> ingredients;
    private List<String> instructions;
    private String dietaryPreference;
    private String userId;
    private String userName;
    private List<String> nutritionalInfo;
    private List<String> portionSizes;
    private List<Comment> comments = new ArrayList<>();
    private List<String> likes = new ArrayList<>(); // List of user IDs who liked the meal plan

    public MealPlan() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public void removeComment(String commentId) {
        comments.removeIf(comment -> comment.getId().equals(commentId));
    }
    public List<String> getImageUrls() {
        return imageUrls;
    }

    public Optional<Comment> updateComment(String commentId, Comment updatedComment) {
        for (int i = 0; i < comments.size(); i++) {
            Comment existingComment = comments.get(i);
            if (existingComment.getId().equals(commentId)) {
                existingComment.setText(updatedComment.getText());  // Assuming Comment has a 'text' field.
                return Optional.of(existingComment);
            }
        }
        return Optional.empty();
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getInstructions() {
        return instructions;
    }

    public void setInstructions(List<String> instructions) {
        this.instructions = instructions;
    }

    public String getDietaryPreference() {
        return dietaryPreference;
    }

    public void setDietaryPreference(String dietaryPreference) {
        this.dietaryPreference = dietaryPreference;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getNutritionalInfo() {
        return nutritionalInfo;
    }

    public void setNutritionalInfo(List<String> nutritionalInfo) {
        this.nutritionalInfo = nutritionalInfo;
    }

    public List<String> getPortionSizes() {
        return portionSizes;
    }

    public void setPortionSizes(List<String> portionSizes) {
        this.portionSizes = portionSizes;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }
}
package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "workout_plans")
public class WorkoutPlan {
    @Id
    private String id;
    private String userId;
    private String title;
    private List<String> imageUrls;
    private List<String> likes = new ArrayList<>();
    private String description;
    private List<String> routines;
    private String userName;
    private List<Comment> comments = new ArrayList<>();
    private List<String> exercises;
    private List<String> sets;
    private List<String> repetitions;

    public WorkoutPlan() {
    }

    // Constructors, Getters, and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }
    public String getUserName() {
        return userName;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<String> getLikes() {
        return likes;
    }
    public void removeComment(String commentId) {
        comments.removeIf(comment -> comment.getId().equals(commentId));
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public List<String> getRoutines() {
        return routines;
    }

    public void setRoutines(List<String> routines) {
        this.routines = routines;
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

    public List<String> getExercises() {
        return exercises;
    }

    public void setExercises(List<String> exercises) {
        this.exercises = exercises;
    }

    public List<String> getSets() {
        return sets;
    }

    public void setSets(List<String> sets) {
        this.sets = sets;
    }

    public List<String> getRepetitions() {
        return repetitions;
    }

    public void setRepetitions(List<String> repetitions) {
        this.repetitions = repetitions;
    }
}
package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Document(collection = "workout_updates")
public class WorkoutUpdate {
    @Id
    private String id;
    private String userId;
    private String title;
    private List<String> imageUrls;
    private List<String> likes = new ArrayList<>();
    private String userName;
    private String description;
    private Date timestamp;
    private double distance;
    private int pushups;
    private double weightLifted;
    private List<Comment> comments = new ArrayList<>();

    public WorkoutUpdate() {
        this.timestamp = new Date();
    }

    public String getTitle() {
        return title;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public void removeComment(String commentId) {
        comments.removeIf(comment -> comment.getId().equals(commentId));
    }
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public int getPushups() {
        return pushups;
    }

    public void setPushups(int pushups) {
        this.pushups = pushups;
    }

    public double getWeightLifted() {
        return weightLifted;
    }

    public void setWeightLifted(double weightLifted) {
        this.weightLifted = weightLifted;
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
package com.example.backend.model;

import java.util.Date;
import java.util.List;

public class Comment {
    private String id;
    private String userId;
    private String text;
    private List<String> likedByUserIds;
    private String commentId;
    private String userName;
    private Date dateCreated;

    public Comment() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    public List<String> getLikedByUserIds() {
        return likedByUserIds;
    }

    public void addLikedByUserId(String userId) {
        this.likedByUserIds.add(userId);
    }

    public void removeLikedByUserId(String userId) {
        this.likedByUserIds.remove(userId);
    }


    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
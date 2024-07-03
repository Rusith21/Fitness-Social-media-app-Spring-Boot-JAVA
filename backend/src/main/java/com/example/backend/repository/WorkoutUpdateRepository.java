package com.example.backend.repository;

import com.example.backend.model.WorkoutUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutUpdateRepository extends MongoRepository<WorkoutUpdate, String> {
    List<WorkoutUpdate> findByUserId(String userId);
}
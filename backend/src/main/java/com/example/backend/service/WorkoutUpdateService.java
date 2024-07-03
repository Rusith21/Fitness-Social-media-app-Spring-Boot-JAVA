package com.example.backend.service;

import com.example.backend.model.Comment;
import com.example.backend.model.WorkoutUpdate;
import com.example.backend.repository.WorkoutUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutUpdateService {
    @Autowired
    private WorkoutUpdateRepository repository;

    public List<WorkoutUpdate> getAllUpdates() {
        return repository.findAll();
    }

    public List<WorkoutUpdate> getUpdatesByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<WorkoutUpdate> getUpdateById(String id) {
        return repository.findById(id);
    }

    public WorkoutUpdate saveUpdate(WorkoutUpdate update) {
        return repository.save(update);
    }

    public Optional<WorkoutUpdate> updateWorkoutUpdate(String id, WorkoutUpdate newUpdate) {
        return repository.findById(id)  // Corrected from findById to repository.findById
                .map(update -> {
                    update.setDescription(newUpdate.getDescription());
                    update.setTimestamp(newUpdate.getTimestamp());
                    update.setDistance(newUpdate.getDistance());
                    update.setPushups(newUpdate.getPushups());
                    update.setWeightLifted(newUpdate.getWeightLifted());
                    return repository.save(update);
                });
    }

    public Optional<WorkoutUpdate> addComment(String id, Comment comment) {
        Optional<WorkoutUpdate> optionalUpdate = repository.findById(id);
        if (optionalUpdate.isPresent()) {
            WorkoutUpdate update = optionalUpdate.get();
            update.addComment(comment);
            return Optional.of(repository.save(update));
        }
        return Optional.empty();
    }

    public boolean deleteUpdate(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
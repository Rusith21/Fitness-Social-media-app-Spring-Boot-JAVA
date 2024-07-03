package com.example.backend.service;

import com.example.backend.model.WorkoutPlan;
import com.example.backend.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository repository;

    public List<WorkoutPlan> getAllPlans() {
        return repository.findAll();
    }

    public List<WorkoutPlan> getPlansByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<WorkoutPlan> getPlanById(String id) {
        return repository.findById(id);
    }

    public WorkoutPlan savePlan(WorkoutPlan plan) {
        return repository.save(plan);
    }

    public Optional<WorkoutPlan> updatePlan(String id, WorkoutPlan newPlan) {
        return repository.findById(id)
                .map(plan -> {
                    plan.setTitle(newPlan.getTitle());
                    plan.setDescription(newPlan.getDescription());
                    plan.setRoutines(newPlan.getRoutines());
                    return repository.save(plan);
                });
    }

    public boolean deletePlan(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
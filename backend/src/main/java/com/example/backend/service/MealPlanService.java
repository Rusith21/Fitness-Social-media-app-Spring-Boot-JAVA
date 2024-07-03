package com.example.backend.service;

import com.example.backend.model.Comment;
import com.example.backend.model.MealPlan;
import com.example.backend.repository.MealPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MealPlanService {
    @Autowired
    private MealPlanRepository repository;

    public List<MealPlan> getAllMealPlans() {
        return repository.findAll();
    }

    public List<MealPlan> getMealPlansByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<MealPlan> getMealPlanById(String id) {
        return repository.findById(id);
    }

    public MealPlan saveMealPlan(MealPlan mealPlan) {
        return repository.save(mealPlan);
    }

    public MealPlan updateMealPlan(String id, MealPlan updatedMealPlan) {
        return repository.findById(id)
                .map(plan -> {
                    plan.setTitle(updatedMealPlan.getTitle());
                    plan.setDescription(updatedMealPlan.getDescription());
                    plan.setIngredients(updatedMealPlan.getIngredients());
                    plan.setInstructions(updatedMealPlan.getInstructions());
                    plan.setDietaryPreference(updatedMealPlan.getDietaryPreference());
                    return repository.save(plan);
                }).orElseGet(() -> {
                    updatedMealPlan.setId(id);
                    return repository.save(updatedMealPlan);
                });
    }

    public boolean deleteComment(String mealPlanId, String commentId) {
        return repository.findById(mealPlanId).map(mealPlan -> {
            boolean hadComment = mealPlan.getComments().removeIf(comment -> comment.getId().equals(commentId));
            if (hadComment) {
                repository.save(mealPlan);
            }
            return hadComment;
        }).orElse(false);
    }

    public boolean deleteMealPlan(String id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
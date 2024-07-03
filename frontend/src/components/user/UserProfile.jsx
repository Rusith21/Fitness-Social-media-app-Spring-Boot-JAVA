/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav, Tab } from 'react-bootstrap';
import { useUser } from './UserContext';
import UserProfileDetails from './UserProfileDetails';
import UserProfileMealPlans from './UserProfileMealPlans';
import UserProfileWorkoutPlans from './UserProfileWorkoutPlans';
import UserProfileWorkoutStatus from './UserProfileWorkoutStatus';

function UserProfile() {
    const [mealPlans, setMealPlans] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [newComment, setNewComment] = useState({});
    const { userId, name } = useUser();
    const [loading, setLoading] = useState(true);
    const [workoutStatuses, setWorkoutStatuses] = useState([]);

    useEffect(() => {
        fetchMealPlans();
        fetchWorkoutPlans();
        fetchWorkoutStatuses();
    }, []);

    useEffect(() => {
        console.log("User ID:", userId);
        console.log("User Name:", name);
    }, [userId, name]);

    useEffect(() => {
        setLoading(false); // Set loading to false once userId is fetched
    }, [userId]);

    const fetchMealPlans = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/meal-plans/user/${userId}`);
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const fetchWorkoutPlans = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/workout-plans/user/${userId}`);
            setWorkoutPlans(response.data);
        } catch (error) {
            console.error('Error fetching workout plans:', error);
        }
    };

    const fetchWorkoutStatuses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/workout-updates/user/${userId}`);
            setWorkoutStatuses(response.data);
        } catch (error) {
            console.error('Error fetching workout statuses:', error);
        }
    };

    const addMealPlanLike = async (mealPlanId) => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await axios.post(`http://localhost:8080/api/meal-plans/${mealPlanId}/like`, { userId });
            const responseData = response.data;
    
            if (responseData.error && responseData.error === 'User has already liked the meal plan.') {
                // Display an alert if the user has already liked the meal plan
                alert('You have already liked this meal plan.');
            } else {
                // Refresh meal plans to show updated likes
                fetchMealPlans();
            }
        } catch (error) {
            console.error('Error adding meal plan like:', error);
            alert('You have already liked this meal plan.');
        }
    };        

    const addWorkoutPlanLike = async (workoutPlanId) => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await axios.post(`http://localhost:8080/api/workout-plans/${workoutPlanId}/like`, { userId });
            const responseData = response.data;
    
            if (responseData.error && responseData.error === 'User has already liked the workout plan.') {
                // Display an alert if the user has already liked the workout plan
                alert('You have already liked this workout plan.');
            } else {
                // Refresh workout plans to show updated likes
                fetchWorkoutPlans();
            }
        } catch (error) {
            console.error('Error adding workout plan like:', error);
            alert('You have already liked this workout plan.');
        }
    };

    const addWorkoutStatusLike = async (workoutStatusId) => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await axios.post(`http://localhost:8080/api/workout-updates/${workoutStatusId}/like`, { userId });
            const responseData = response.data;
    
            if (responseData.error && responseData.error === 'User has already liked the workout update.') {
                // Display an alert if the user has already liked the workout status
                alert('You have already liked this workout status.');
            } else {
                // Refresh workout statuses to show updated likes
                fetchWorkoutStatuses();
            }
        } catch (error) {
            console.error('Error adding workout status like:', error);
            alert('You have already liked this workout status.');
        }
    };

    const handleMealPlanCommentChange = (mealPlanId, text) => {
        setNewComment({ ...newComment, [`mealPlan_${mealPlanId}`]: text });
    };

    const handleWorkoutPlanCommentChange = (workoutPlanId, text) => {
        setNewComment({ ...newComment, [`workoutPlan_${workoutPlanId}`]: text });
    };

    const handleWorkoutStatusCommentChange = (workoutStatusId, text) => {
        setNewComment({ ...newComment, [`workoutStatus_${workoutStatusId}`]: text });
    };

    const addMealPlanComment = async (mealPlanId) => {
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
            console.error('User ID or User Name is missing.');
            return;
        }
    
        const commentText = newComment[`mealPlan_${mealPlanId}`];
    
        if (!commentText) {
            console.error('Comment text is missing.');
            return;
        }
    
        try {
            await axios.post(`http://localhost:8080/api/meal-plans/${mealPlanId}/comment`, {
                text: commentText,
                userId: userId,
                userName: userId.userName
            });
            fetchMealPlans();
            setNewComment({ ...newComment, [`mealPlan_${mealPlanId}`]: '' });
        } catch (error) {
            console.error('Error adding meal plan comment:', error);
        }
    };
    
    const deleteMealPlanComment = async (mealPlanId, commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/meal-plans/${mealPlanId}/comment/${commentId}`);
            fetchMealPlans(); // Refresh meal plans after deleting comment
        } catch (error) {
            console.error('Error deleting meal plan comment:', error);
        }
    };

    const deleteWorkoutPlanComment = async (workoutPlanId, commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/work-plans/${workoutPlanId}/comment/${commentId}`);
            fetchMealPlans(); // Refresh meal plans after deleting comment
        } catch (error) {
            console.error('Error deleting workout plan comment:', error);
        }
    };

    const deleteWorkoutUpdateComment = async (workoutUpdateId, commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/workout-updates/${workoutUpdateId}/comment/${commentId}`);
            fetchMealPlans(); // Refresh meal plans after deleting comment
        } catch (error) {
            console.error('Error deleting meal plan comment:', error);
        }
    };
    const updateMealPlanComment = (mealPlanId, commentId, updatedComment) => {
        return fetch(`http://localhost:8080/api/meal-plans/${mealPlanId}/comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedComment)
        })
        .then(response => response.json())
        .catch(error => console.error('Error updating comment:', error));
    };

    const addWorkoutStatusComment = async (workoutStatusId) => {
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
            console.error('User ID or User Name is missing.');
            return;
        }
    
        if (newComment[`workoutStatus_${workoutStatusId}`]) {
            try {
                await axios.post(`http://localhost:8080/api/workout-updates/${workoutStatusId}/comment`, {
                    text: newComment[`workoutStatus_${workoutStatusId}`],
                    userId: userId,
                    userName: userId.userName
                });
                fetchWorkoutStatuses(); // Refresh workout statuses to show new comment
                setNewComment({ ...newComment, [`workoutStatus_${workoutStatusId}`]: '' }); // Clear input field after submission
            } catch (error) {
                console.error('Error adding workout status comment:', error);
            }
        }
    };
    
    const addWorkoutPlanComment = async (workoutPlanId) => {
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
            console.error('User ID or User Name is missing.');
            return;
        }
    
        if (newComment[`workoutPlan_${workoutPlanId}`]) {
            try {
                await axios.post(`http://localhost:8080/api/workout-plans/${workoutPlanId}/comment`, {
                    text: newComment[`workoutPlan_${workoutPlanId}`],
                    userId: userId,
                    userName: userId.userName
                });
                fetchWorkoutPlans(); // Refresh workout plans to show new comment
                setNewComment({ ...newComment, [`workoutPlan_${workoutPlanId}`]: '' }); // Clear input field after submission
            } catch (error) {
                console.error('Error adding workout plan comment:', error);
            }
        }
    };    

    return (
        <Tab.Container id="home-tabs" defaultActiveKey="view-meal-plans">
            <UserProfileDetails userId={userId} name={name} />
            <Nav variant="tabs">
            
                <Nav.Item style={{ width: '33%' }}>
                    <Nav.Link eventKey="view-meal-plans">My Meal Plans</Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ width: '33%' }}>
                    <Nav.Link eventKey="view-workout-plans">My Workout Plans</Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ width: '33%' }}>
                    <Nav.Link eventKey="view-workout-status">My Workout Status</Nav.Link>
                </Nav.Item>
                
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="view-meal-plans">
                    <UserProfileMealPlans
                        mealPlans={mealPlans}
                        addMealPlanLike={addMealPlanLike}
                        addMealPlanComment={addMealPlanComment}
                        updateMealPlanComment={updateMealPlanComment}
                        deleteMealPlanComment={deleteMealPlanComment}
                        handleMealPlanCommentChange={handleMealPlanCommentChange}
                        newComment={newComment}
                    />
                </Tab.Pane>
                <Tab.Pane eventKey="view-workout-plans">
                    <UserProfileWorkoutPlans
                        workoutPlans={workoutPlans}
                        addWorkoutPlanLike={addWorkoutPlanLike}
                        addWorkoutPlanComment={addWorkoutPlanComment}
                        deleteWorkoutPlanComment={deleteWorkoutPlanComment}
                        handleWorkoutPlanCommentChange={handleWorkoutPlanCommentChange}
                        newComment={newComment}
                    />
                </Tab.Pane>
                <Tab.Pane eventKey="view-workout-status">
                    <UserProfileWorkoutStatus
                        workoutStatuses={workoutStatuses}
                        addWorkoutStatusLike={addWorkoutStatusLike}
                        addWorkoutStatusComment={addWorkoutStatusComment}
                        deleteWorkoutUpdateComment={deleteWorkoutUpdateComment}
                        handleWorkoutStatusCommentChange={handleWorkoutStatusCommentChange}
                        newComment={newComment}
                    />
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default UserProfile;
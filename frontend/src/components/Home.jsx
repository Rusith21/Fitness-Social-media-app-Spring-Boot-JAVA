import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import ViewMealPlans from './ViewMealPlans';
import ViewWorkoutPlans from './ViewWorkoutPlans';
import ViewWorkoutStatus from './ViewWorkoutStatus';

function HomePage() {
    const [mealPlans, setMealPlans] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [newComment, setNewComment] = useState({});
    const [workoutStatuses, setWorkoutStatuses] = useState([]);

    useEffect(() => {
        fetchMealPlans();
        fetchWorkoutPlans();
        fetchWorkoutStatuses();
        console.log("User ID:", localStorage.getItem("userId"));
    }, []);

    const fetchMealPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/meal-plans');
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const fetchWorkoutPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/workout-plans');
            setWorkoutPlans(response.data);
        } catch (error) {
            console.error('Error fetching workout plans:', error);
        }
    };

    const fetchWorkoutStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/workout-updates');
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
        if (newComment[`mealPlan_${mealPlanId}`]) {
            try {
                const userId = localStorage.getItem("userId");
    
                if (!userId) {
                    console.error('User ID or User Name is missing.');
                    return;
                }
    
                await axios.post(`http://localhost:8080/api/meal-plans/${mealPlanId}/comment`, {
                    text: newComment[`mealPlan_${mealPlanId}`],
                    userId: userId,
                    userName: userId.userName,
                });
                fetchMealPlans(); // Refresh meal plans to show new comment
                setNewComment({ ...newComment, [`mealPlan_${mealPlanId}`]: '' }); // Clear input field after submission
            } catch (error) {
                console.error('Error adding meal plan comment:', error);
            }
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

    const addWorkoutStatusComment = async (workoutStatusId) => {
        if (newComment[`workoutStatus_${workoutStatusId}`]) {
            try {
                const userId = localStorage.getItem("userId");
    
                if (!userId) {
                    console.error('User ID or User Name is missing.');
                    return;
                }
    
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
        if (newComment[`workoutPlan_${workoutPlanId}`]) {
            try {
                const userId = localStorage.getItem("userId");
    
                if (!userId) {
                    console.error('User ID or User Name is missing.');
                    return;
                }
    
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
        <Container fluid>
            <Row>
                <h5 style={{textAlign: "center", margin: "25px"}}>Latest Workout Status</h5>
                <Col>
                    <ViewWorkoutStatus
                        workoutStatuses={workoutStatuses}
                        handleWorkoutStatusCommentChange={handleWorkoutStatusCommentChange}
                        addWorkoutStatusComment={addWorkoutStatusComment}
                        deleteWorkoutUpdateComment={deleteWorkoutUpdateComment}
                        newComment={newComment}
                        addWorkoutStatusLike={addWorkoutStatusLike}
                    />
                </Col>
            </Row>
            <Row>
            <h5 style={{textAlign: "center", margin: "25px"}}>Fitness Community</h5>
                <Col>
                    <Tab.Container id="home-tabs" defaultActiveKey="view-meal-plans">
                        <Nav variant="tabs">
                            <Nav.Item style={{ width: '50%' }}>
                                <Nav.Link eventKey="view-meal-plans">View Meal Plans</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{ width: '50%' }}>
                                <Nav.Link eventKey="view-workout-plans">View Workout Plans</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="view-meal-plans">
                                <ViewMealPlans
                                    mealPlans={mealPlans}
                                    handleMealPlanCommentChange={handleMealPlanCommentChange}
                                    addMealPlanComment={addMealPlanComment}
                                    deleteMealPlanComment={deleteMealPlanComment}
                                    newComment={newComment}
                                    addMealPlanLike={addMealPlanLike}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="view-workout-plans">
                                {/* Add horizontal scrolling for workout plans */}
                                <div style={{ overflowX: 'auto' }}>
                                    <ViewWorkoutPlans
                                        workoutPlans={workoutPlans}
                                        handleWorkoutPlanCommentChange={handleWorkoutPlanCommentChange}
                                        addWorkoutPlanComment={addWorkoutPlanComment}
                                        deleteWorkoutPlanComment={deleteWorkoutPlanComment}
                                        newComment={newComment}
                                        addWorkoutPlanLike={addWorkoutPlanLike}
                                    />
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/workout-updates';

function ViewAllWorkoutStatus() {
    const [workoutStatuses, setWorkoutStatuses] = useState([]);

    useEffect(() => {
        fetchWorkoutStatuses();
    }, []);

    const fetchWorkoutStatuses = async () => {
        try {
            const response = await axios.get(API_URL);
            setWorkoutStatuses(response.data);
        } catch (error) {
            console.error('Error fetching workout statuses:', error);
        }
    };

    const handleLike = async (id) => {
        try {
            await axios.post(`${API_URL}/${id}/like`);
            fetchWorkoutStatuses(); // Refresh workout statuses after liking
        } catch (error) {
            console.error('Error liking workout status:', error);
        }
    };

    const handleComment = async (id) => {
        try {
            const commentText = prompt('Enter your comment:');
            if (commentText) {
                await axios.post(`${API_URL}/${id}/comment`, { text: commentText });
                fetchWorkoutStatuses(); // Refresh workout statuses after commenting
            }
        } catch (error) {
            console.error('Error commenting on workout status:', error);
        }
    };

    return (
        <div className="mt-4">
            {workoutStatuses.map(status => (
                <Card key={status.id} className="mb-3">
                    <Card.Body>
                    <Card.Title>Description: {status.tite}</Card.Title>
                        <Card.Text>Description: {status.description}</Card.Text>
                        <Card.Text>Distance: {status.distance}</Card.Text>
                        <Card.Text>Pushups: {status.pushups}</Card.Text>
                        <Card.Text>Weight Lifted: {status.weightLifted}</Card.Text>
                        <div>
                            <strong>Comments:</strong>
                            <ul>
                                {status.comments.map((comment, index) => (
                                    <li key={index}>{comment.text}</li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="primary" onClick={() => handleLike(status.id)}>Like ({status.likes || 0})</Button>{' '}
                        <Button variant="info" onClick={() => handleComment(status.id)}>Comment</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default ViewAllWorkoutStatus;
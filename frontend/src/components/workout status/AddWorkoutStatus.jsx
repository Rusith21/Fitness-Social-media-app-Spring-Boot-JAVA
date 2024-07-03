import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/workout-updates';

function AddWorkoutStatus() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [workoutStatus, setWorkoutStatus] = useState({
        title: '',
        description: '',
        distance: 0,
        pushups: 0,
        weightLifted: 0,
        userId: user ? user.id : null,
        imageFiles: null, // New state to store image files
    });

    useEffect(() => {
        if (user) {
            setWorkoutStatus(prevStatus => ({ ...prevStatus, userId: user.id }));
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Validate and restrict numbers greater than 20
        if (['distance', 'pushups', 'weightLifted'].includes(name)) {
            const inputValue = parseFloat(value);
            if (inputValue > 20) {
                alert('Maximum value allowed for ' + name + ' is 20.');
                return;
            }
        }

        setWorkoutStatus({ ...workoutStatus, [name]: value });
    };

    const handleImageChange = (event) => {
        setWorkoutStatus({ ...workoutStatus, imageFiles: event.target.files }); // Store selected image files
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            alert('You must be logged in to add a workout status.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', workoutStatus.title);
            formData.append('description', workoutStatus.description);
            formData.append('distance', workoutStatus.distance);
            formData.append('pushups', workoutStatus.pushups);
            formData.append('weightLifted', workoutStatus.weightLifted);
            formData.append('userId', workoutStatus.userId);
            if (workoutStatus.imageFiles) {
                for (let i = 0; i < workoutStatus.imageFiles.length; i++) {
                    formData.append('imageFiles', workoutStatus.imageFiles[i]); // Append each selected image file
                }
            }

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Workout Status Added!');
            navigate('/home');
            console.log(response.data);
            setWorkoutStatus({
                title: '',
                description: '',
                distance: 0,
                pushups: 0,
                weightLifted: 0,
                userId: user.id,
                imageFiles: null,
            });
        } catch (error) {
            console.error('Failed to add workout status:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white", margin: "auto" }}>
                <Card.Body>
                    <Card.Title style={{ textAlign: "center", margin: "25px" }}><h3>Add Workout Status</h3></Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={workoutStatus.title} onChange={handleChange} placeholder="Title" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={workoutStatus.description} onChange={handleChange} placeholder="Description" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Distance</Form.Label>
                            <Form.Control type="number" min="0" name="distance" value={workoutStatus.distance} onChange={handleChange} placeholder="Distance" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pushups</Form.Label>
                            <Form.Control type="number" name="pushups" min="0" value={workoutStatus.pushups} onChange={handleChange} placeholder="Pushups" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Weight Lifted</Form.Label>
                            <Form.Control type="number" name="weightLifted" value={workoutStatus.weightLifted} min="0" onChange={handleChange} placeholder="Weight Lifted" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type="file"
                                name="imageFiles"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>Share Workout Status</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddWorkoutStatus;
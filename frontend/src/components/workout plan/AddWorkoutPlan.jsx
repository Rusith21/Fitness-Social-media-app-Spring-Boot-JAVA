import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, FormControl, Button, Card } from 'react-bootstrap';
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/workout-plans';

function AddWorkoutPlan() {
    const [workoutPlan, setWorkoutPlan] = useState({
        title: '',
        description: '',
        routines: [],
        exercises: [],
        sets: [],
        repetitions: [],
        imageFiles: null, // New state to store image files
    });

    const { user } = useUser();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        let arrayValue = value.split('\n');
        
        // Display alert if more than 4 entries are added
        if (arrayValue.length > 4) {
            alert('Maximum 4 entries allowed for ' + name);
            return;
        }

        if (name === 'routines' || name === 'exercises' || name === 'sets' || name === 'repetitions') {
            setWorkoutPlan({ ...workoutPlan, [name]: arrayValue });
        } else {
            setWorkoutPlan({ ...workoutPlan, [name]: value });
        }
    };

    const handleImageChange = (event) => {
        setWorkoutPlan({ ...workoutPlan, imageFiles: event.target.files }); // Store selected image files
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if any of the required fields are empty
        if (!workoutPlan.title || !workoutPlan.description || !workoutPlan.imageFiles) {
            alert('Please fill in all required fields and select at least one image.');
            return;
        }

        // Check if routines, exercises, sets, and repetitions have at least one value
        if (
            workoutPlan.routines.length === 0 ||
            workoutPlan.exercises.length === 0 ||
            workoutPlan.sets.length === 0 ||
            workoutPlan.repetitions.length === 0
        ) {
            alert('Please provide at least one value for routines, exercises, sets, and repetitions.');
            return;
        }

        const formData = new FormData();
        formData.append('title', workoutPlan.title);
        formData.append('description', workoutPlan.description);
        formData.append('userId', user.id);
        workoutPlan.routines.forEach(item => formData.append('routines', item));
        workoutPlan.exercises.forEach(item => formData.append('exercises', item));
        workoutPlan.sets.forEach(item => formData.append('sets', item));
        workoutPlan.repetitions.forEach(item => formData.append('repetitions', item));
        for (let i = 0; i < workoutPlan.imageFiles.length; i++) {
            formData.append('imageFiles', workoutPlan.imageFiles[i]); // Append each selected image file
        }

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Workout Plan Added!');
            navigate('/home');
            setWorkoutPlan({
                title: '',
                description: '',
                routines: [],
                exercises: [],
                sets: [],
                repetitions: [],
                imageFiles: null,
            });
        } catch (error) {
            console.error('Failed to add workout plan:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white" }}>
                <Card.Body>
                    <Card.Title style={{textAlign: "center", margin: "25px"}}><h3>Add New Workout Plan</h3></Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <FormControl
                                type="text"
                                name="title"
                                value={workoutPlan.title}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Title"
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <FormControl
                                as="textarea"
                                name="description"
                                value={workoutPlan.description}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Description"
                            />
                        </Form.Group>
                        <Form.Group controlId="routines">
                            <Form.Label>Routines (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="routines"
                                value={workoutPlan.routines.join('\n')}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Routines"
                            />
                        </Form.Group>
                        <Form.Group controlId="exercises">
                            <Form.Label>Exercises (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="exercises"
                                value={workoutPlan.exercises.join('\n')}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Exercises"
                            />
                        </Form.Group>
                        <Form.Group controlId="sets">
                            <Form.Label>Sets (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="sets"
                                value={workoutPlan.sets.join('\n')}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Sets"
                            />
                        </Form.Group>
                        <Form.Group controlId="repetitions">
                            <Form.Label>Repetitions (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="repetitions"
                                value={workoutPlan.repetitions.join('\n')}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Repetitions"
                            />
                        </Form.Group>
                        <Form.Group controlId="imageFiles">
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type="file"
                                name="imageFiles"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>
                            Share Workout Plan
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddWorkoutPlan;
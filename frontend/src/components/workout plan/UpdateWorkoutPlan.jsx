import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, FormControl, Button, Card, Row, Col } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/workout-plans';

function UpdateWorkoutPlan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState({
        title: '',
        description: '',
        routines: [],
        exercises: [],
        sets: [],
        repetitions: []
    });

    useEffect(() => {
        const fetchWorkoutPlan = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                const updatedWorkoutPlan = {
                    ...response.data,
                    routines: response.data.routines || [],
                    exercises: response.data.exercises || [],
                    sets: response.data.sets || [],
                    repetitions: response.data.repetitions || []
                };
                setWorkoutPlan(updatedWorkoutPlan);
            } catch (error) {
                console.error('Error fetching workout plan:', error);
            }
        };
        fetchWorkoutPlan();
    }, [id]);    

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'routines' || name === 'exercises' || name === 'sets' || name === 'repetitions') {
            const arrayValue = value.split('\n');
            setWorkoutPlan(prevState => ({ ...prevState, [name]: arrayValue }));
        } else {
            setWorkoutPlan(prevState => ({ ...prevState, [name]: value }));
        }
    };    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`${API_URL}/${id}`, workoutPlan);
            alert('Workout Plan Updated!');
            navigate('/home');
        } catch (error) {
            alert('Failed to update workout plan: ' + error.message);
        }
    };

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white" }}>
                <Card.Body>
                    <Card.Title style={{textAlign: "center", margin: "25px"}}><h3>Update Workout Plan</h3></Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <FormControl
                                type="text"
                                name="title"
                                value={workoutPlan.title}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Title"
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <FormControl
                                as="textarea"
                                name="description"
                                value={workoutPlan.description}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Description"
                            />
                        </Form.Group>
                        <Form.Group controlId="routines">
                            <Form.Label>Routines (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="routines"
                                value={workoutPlan.routines.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Routines"
                            />
                        </Form.Group>
                        <Form.Group controlId="exercises">
                            <Form.Label>Exercises (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="exercises"
                                value={workoutPlan.exercises.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Exercises"
                            />
                        </Form.Group>
                        <Form.Group controlId="sets">
                            <Form.Label>Sets (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="sets"
                                value={workoutPlan.sets.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Sets"
                            />
                        </Form.Group>
                        <Form.Group controlId="repetitions">
                            <Form.Label>Repetitions (one per line)</Form.Label>
                            <FormControl
                                as="textarea"
                                name="repetitions"
                                value={workoutPlan.repetitions.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Repetitions"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>
                            Update Workout Plan
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UpdateWorkoutPlan;
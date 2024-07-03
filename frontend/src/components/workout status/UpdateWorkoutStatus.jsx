import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Card } from 'react-bootstrap';

const API_URL = 'http://localhost:8080/api/workout-updates';

function UpdateWorkoutStatus() {
    const { id } = useParams();
    const [workoutStatus, setWorkoutStatus] = useState({
        title: '',
        description: '',
        distance: 0,
        pushups: 0,
        weightLifted: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkoutStatus();
    }, []);

    const fetchWorkoutStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            setWorkoutStatus(response.data);
        } catch (error) {
            console.error('Error fetching workout status:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Validate and restrict to 20 or less
        if (['distance', 'pushups', 'weightLifted'].includes(name)) {
            const inputValue = parseFloat(value);
            if (inputValue > 20) {
                alert('Maximum value allowed for ' + name + ' is 20.');
                return;
            }
        }

        setWorkoutStatus(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/${id}`, workoutStatus);
            alert('Workout Status Updated!');
            navigate("/home");
            console.log(response.data);
        } catch (error) {
            console.error('Failed to update workout status:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white" }}>
                <Card.Body>
                    <Card.Title style={{ textAlign: "center", margin: "25px" }}><h3>Update Workout Status</h3></Card.Title>
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
                            <Form.Control type="number" name="distance" min="0" value={workoutStatus.distance} onChange={handleChange} placeholder="Distance" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pushups</Form.Label>
                            <Form.Control type="number" name="pushups" value={workoutStatus.pushups} min="0" onChange={handleChange} placeholder="Pushups" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Weight Lifted</Form.Label>
                            <Form.Control type="number" name="weightLifted" value={workoutStatus.weightLifted} onChange={handleChange} min="0" placeholder="Weight Lifted" style={{ backgroundColor: "#196794", border: 0, color: "white" }} />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>Update Workout Status</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UpdateWorkoutStatus;
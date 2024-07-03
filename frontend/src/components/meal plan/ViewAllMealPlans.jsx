import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';

function ViewAllMealPlans() {
    const [mealPlans, setMealPlans] = useState([]);
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/meal-plans');
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const addLike = async (mealPlanId) => {
        try {
            await axios.post(`http://localhost:8080/api/meal-plans/${mealPlanId}/like`);
            fetchMealPlans();
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };

    const handleCommentChange = (mealPlanId, text) => {
        setNewComment({ ...newComment, [mealPlanId]: text });
    };

    const addComment = async (mealPlanId) => {
        if (newComment[mealPlanId]) {
            try {
                await axios.post(`http://localhost:8080/api/meal-plans/${mealPlanId}/comment`, { text: newComment[mealPlanId] });
                fetchMealPlans();
                setNewComment({ ...newComment, [mealPlanId]: '' });
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2>All Meal Plans</h2>
            <Row xs={1} md={3} lg={1} className="g-4">
                {mealPlans.map(mealPlan => (
                    <Col key={mealPlan.id}>
                        <Card className="mb-3 h-100">
                            <Card.Body>
                                <Card.Title>{mealPlan.title}</Card.Title>
                                <Card.Text>{mealPlan.description}</Card.Text>
                                <Button variant="primary" onClick={() => addLike(mealPlan.id)}>Like ({mealPlan.likes || 0})</Button>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment[mealPlan.id] || ''}
                                        onChange={e => handleCommentChange(mealPlan.id, e.target.value)}
                                    />
                                    <Button variant="outline-secondary" onClick={() => addComment(mealPlan.id)}>
                                        Comment
                                    </Button>
                                </Form.Group>
                                <Card.Text>
                                    <strong>Comments:</strong>
                                    <ul>
                                        {mealPlan.comments.map((comment, index) => (
                                            <li key={index}>{comment.text}</li>
                                        ))}
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>    
    );
}

export default ViewAllMealPlans;
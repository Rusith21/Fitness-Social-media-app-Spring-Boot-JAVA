/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { RiAddLine } from 'react-icons/ri'; // Import the RiAddLine icon

const API_URL = 'http://localhost:8080/api/meal-plans';

function UpdateMealPlan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mealPlan, setMealPlan] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        dietaryPreference: '',
        nutritionalInfo: '',
        portionSizes: ''
    });

    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                const data = response.data;
                data.ingredients = data.ingredients.join(', ');
                setMealPlan(data);
            } catch (error) {
                console.error('Error fetching meal plan:', error);
            }
        };
        fetchMealPlan();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMealPlan({ ...mealPlan, [name]: value });
    };

    const handleArrayChange = (event, fieldName) => {
        const { value } = event.target;
        setMealPlan({ ...mealPlan, [fieldName]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!mealPlan.title || !mealPlan.description || !mealPlan.dietaryPreference) {
            alert('Please fill in all required fields.');
            return;
        }
        const updatedMealPlan = {
            ...mealPlan,
            ingredients: mealPlan.ingredients.split(',').map(ingredient => ingredient.trim())
        };
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedMealPlan);
            alert('Meal Plan Updated!');
            navigate('/home');
        } catch (error) {
            console.error('Failed to update meal plan:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white" }}>
                <Card.Body>
                    <Card.Title style={{textAlign: "center", margin: "25px"}}><h3>Update Meal Plan</h3></Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={mealPlan.title}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Enter meal plan title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={mealPlan.description}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Describe the meal plan"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dietary Preferences</Form.Label>
                            <Form.Select
                                name="dietaryPreference"
                                value={mealPlan.dietaryPreference}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                            >
                                <option value="">Choose Diet Type</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="keto">Keto</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="ingredients"
                                value={mealPlan.ingredients}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="List ingredients separated by new lines"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nutritional Information</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="nutritionalInfo"
                                value={mealPlan.nutritionalInfo}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Enter nutritional information separated by new lines"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Portion Sizes</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="portionSizes"
                                value={mealPlan.portionSizes}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Enter portion sizes separated by new lines"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="instructions"
                                value={mealPlan.instructions}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Cooking instructions"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>Update Meal Plan</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UpdateMealPlan;
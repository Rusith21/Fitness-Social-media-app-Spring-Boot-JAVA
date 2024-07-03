import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { useUser } from '../user/UserContext'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/meal-plans';

function AddMealPlan() {
    const [mealPlan, setMealPlan] = useState({
        title: '',
        description: '',
        ingredients: [],
        instructions: [],
        dietaryPreference: '',
        nutritionalInfo: [],
        portionSizes: [],
    });
    const [images, setImages] = useState([]);
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

        if (name === 'ingredients' || name === 'nutritionalInfo' || name === 'portionSizes' || name === 'instructions') {
            setMealPlan({ ...mealPlan, [name]: arrayValue });
        } else {
            setMealPlan({ ...mealPlan, [name]: value });
        }
    };     

    const handleImageChange = (event) => {
        setImages([...event.target.files]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!mealPlan.title || !mealPlan.description || !mealPlan.dietaryPreference || images.length === 0) {
            alert('Please fill in all required fields and select at least one image.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', mealPlan.title);
            formData.append('description', mealPlan.description);
            formData.append('dietaryPreference', mealPlan.dietaryPreference);
            formData.append('userId', user.id);
            formData.append('userName', user.name);
            mealPlan.ingredients.forEach(ingredient => formData.append('ingredients', ingredient));
            mealPlan.instructions.forEach(instruction => formData.append('instructions', instruction));
            mealPlan.nutritionalInfo.forEach(info => formData.append('nutritionalInfo', info));
            mealPlan.portionSizes.forEach(size => formData.append('portionSizes', size));
            images.forEach(image => formData.append('imageFiles', image));

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Meal Plan Added!');
            navigate('/home');
            setMealPlan({
                title: '',
                description: '',
                ingredients: [],
                instructions: [],
                dietaryPreference: '',
                nutritionalInfo: [],
                portionSizes: [],
            });
            setImages([]);
        } catch (error) {
            console.error('Failed to add meal plan:', error);
        }
    };        

    return (
        <Container className="mt-4">
            <Card style={{ backgroundColor: "#6CC0F1", border: "1px solid #ced4da", color: "white" }}>
                <Card.Body>
                    <Card.Title style={{textAlign: "center", margin: "25px"}}><h3>Add New Meal Plan</h3></Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={mealPlan.title}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Enter meal plan title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={mealPlan.description}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Describe the meal plan"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dietary Preferences</Form.Label>
                            <Form.Select
                                name="dietaryPreference"
                                value={mealPlan.dietaryPreference}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
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
                                value={mealPlan.ingredients.join('\n')}
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
                                value={mealPlan.nutritionalInfo.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Enter nutritional information"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Portion Sizes</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="portionSizes"
                                value={mealPlan.portionSizes.join('\n')}
                                onChange={handleChange}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                placeholder="Enter portion sizes"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="instructions"
                                value={mealPlan.instructions.join('\n')}
                                style={{backgroundColor: "#196794", border: 0, color: "white"}}
                                onChange={handleChange}
                                placeholder="Enter cooking instructions"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type="file"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#196794", border: 0, color: "white", textAlign: "center", marginTop: "25px" }}>Share Meal Plan</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddMealPlan;
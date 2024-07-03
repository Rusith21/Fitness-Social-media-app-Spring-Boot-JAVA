import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { Container, Button, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

function GetUserMealPlans() {
    const [mealPlans, setMealPlans] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            const fetchMealPlans = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/meal-plans/user/${user.id}`);
                    setMealPlans(response.data);
                } catch (error) {
                    console.error('Error fetching meal plans:', error);
                }
            };

            fetchMealPlans();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meal plan?')) {
            try {
                await axios.delete(`http://localhost:8080/api/meal-plans/${id}`);
                alert('Meal Plan Deleted Successfully!');
                window.location.reload();
                setMealPlans(mealPlans.filter(plan => plan.id !== id));
            } catch (error) {
                console.error('Failed to delete meal plan:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-meal-plan/${id}`);
    };

    return (
        <Container className="mt-4">
            <h3 style={{textAlign: "center", margin: "25px"}}>My Meal Plans</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Title</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Description</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Ingredients</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Nutritional Info</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Portion Sizes</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Instructions</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Dietary Preference</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mealPlans.map(mealPlan => (
                        <tr key={mealPlan.id}>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{mealPlan.title}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{mealPlan.description}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                <ol>
                                    {mealPlan.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ol>
                            </td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                <ol>
                                    {mealPlan.nutritionalInfo && mealPlan.nutritionalInfo.map((info, index) => (
                                        <li key={index}>{info}</li>
                                    ))}
                                </ol>
                            </td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                <ol>
                                    {mealPlan.portionSizes && mealPlan.portionSizes.map((portion, index) => (
                                        <li key={index}>{portion}</li>
                                    ))}
                                </ol>
                            </td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                <ol>
                                    {mealPlan.instructions && mealPlan.instructions.map((instructions, index) => (
                                        <li key={index}>{instructions}</li>
                                    ))}
                                </ol>
                            </td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{mealPlan.dietaryPreference}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                            <Button variant="primary" className="me-2" onClick={() => handleEdit(mealPlan.id)}>
    <FaEdit />
</Button>
<Button variant="danger" onClick={() => handleDelete(mealPlan.id)}>
    <FaTrash />
</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default GetUserMealPlans;
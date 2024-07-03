import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { Container, Button, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

function GetUserWorkoutPlans() {
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            const fetchWorkoutPlans = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/workout-plans/user/${user.id}`);
                    console.log('Fetched workout plans:', response.data); // Add this line to check the fetched data
                    setWorkoutPlans(response.data);
                } catch (error) {
                    console.error('Error fetching workout plans:', error);
                }
            };
    
            fetchWorkoutPlans();
        }
    }, [user]);    

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout plan?')) {
            try {
                await axios.delete(`http://localhost:8080/api/workout-plans/${id}`);
                alert('Workout Plan Deleted Successfully!');
                window.location.reload();
            } catch (error) {
                console.error('Error deleting workout plan:', error);
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-workout-plan/${id}`);
    };

    return (
        <Container className="mt-4">
            <h3 style={{textAlign: "center", margin: "25px"}}>My Workout Plans</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Title</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Description</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Exercises</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Sets</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Repetitions</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workoutPlans.map(plan => (
                        <tr key={plan.id}>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{plan.title}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{plan.description}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
    <ol>
        {plan.exercises && plan.exercises.map((exercise, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>{exercise}</li>
        ))}
    </ol>
</td>
<td style={{ backgroundColor: "#196794", color: "white" }}>
    <ol>
        {plan.sets && plan.sets.map((set, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>{set}</li>
        ))}
    </ol>
</td>
<td style={{ backgroundColor: "#196794", color: "white" }}>
    <ol>
        {plan.repetitions && plan.repetitions.map((repetition, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>{repetition}</li>
        ))}
    </ol>
</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                            <Button variant="primary" className="me-2" onClick={() => handleUpdate(plan.id)}>
    <FaEdit />
</Button>
<Button variant="danger" onClick={() => handleDelete(plan.id)}>
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

export default GetUserWorkoutPlans;
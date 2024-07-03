import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { Container, Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

function GetUserWorkoutStats() {
    const [workoutStats, setWorkoutStats] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            const fetchWorkoutStats = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/workout-updates/user/${user.id}`);
                    setWorkoutStats(response.data);
                } catch (error) {
                    console.error('Error fetching workout stats:', error);
                }
            };

            fetchWorkoutStats();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout status?')) {
            try {
                await axios.delete(`http://localhost:8080/api/workout-updates/${id}`);
                window.location.reload();
            } catch (error) {
                console.error('Error deleting workout status:', error);
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-workout-status/${id}`);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <Container className="mt-4">
            <h2>My Workout Status</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Title</th>
                    <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Description</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Date</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Distance</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Pushups</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Weight Lifted</th>
                        <th style={{ backgroundColor: "#6CC0F1", color: "white" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workoutStats.map(stat => (
                        <tr key={stat.id}>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{stat.title}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{stat.description}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{formatTimestamp(stat.timestamp)}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{stat.distance}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{stat.pushups}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>{stat.weightLifted}</td>
                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                <Button variant="primary" className="me-2" onClick={() => handleUpdate(stat.id)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(stat.id)}>
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

export default GetUserWorkoutStats;
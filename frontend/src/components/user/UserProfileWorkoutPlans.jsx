import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Table } from 'react-bootstrap';
import LikeButton from '../LikeButton';
import CommentsModal from '../CommentsModal';

function UserProfileWorkoutPlans({ workoutPlans, addWorkoutPlanLike, addWorkoutPlanComment, handleWorkoutPlanCommentChange, deleteWorkoutPlanComment, newComment }) {
    const [showComments, setShowComments] = useState(false);
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);

    const handleShowComments = (workoutPlan) => {
        setSelectedWorkoutPlan(workoutPlan);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const updateComment = (commentId, updatedText) => {
        fetch(`http://localhost:8080/api/workout-plans/${selectedWorkoutPlan.id}/comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: updatedText })
        })
        .then(response => response.json())
        .then(data => {
            // Refresh comments in the UI
            selectedWorkoutPlan(prev => ({
                ...prev,
                comments: prev.comments.map(comment =>
                    comment.id === commentId ? { ...comment, text: updatedText } : comment
                )
            }));
        })
        .catch(error => console.error('Error updating comment:', error));
    };

    const handleDeleteComment = async (commentId) => {
        try {
            // Assuming deleteWorkoutPlanComment is an async function making an API call
            await deleteWorkoutPlanComment(selectedWorkoutPlan.id, commentId);
            
            // Option 1: Remove the comment from the selectedWorkoutPlan in the state directly if no API endpoint is available for fetching updated comments.
            const updatedComments = selectedWorkoutPlan.comments.filter(comment => comment.id !== commentId);
            setSelectedWorkoutPlan(prev => ({ ...prev, comments: updatedComments }));
    
            // Option 2: If an API endpoint is available to fetch the updated list of comments, call it here.
            // const updatedComments = await fetchComments(selectedWorkoutPlan.id);
            // setSelectedWorkoutPlan(prev => ({ ...prev, comments: updatedComments }));
        } catch (error) {
            console.error('Failed to delete the comment:', error);
            // Optionally, inform the user that the comment deletion failed
        }
    };    

    return (
        <Container>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ margin: "25px" }}>
                {Array.isArray(workoutPlans) && workoutPlans.length > 0 ? (
                    workoutPlans.map(workoutPlan => (
                        <Col key={workoutPlan.id}>
                            <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px", backgroundColor: "#6CC0F1", color: "white" }}>
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>{workoutPlan.title}</Card.Title>
                                    <Card.Text>{workoutPlan.description}</Card.Text>
                                    <Card.Text>Posted By {workoutPlan.userName}</Card.Text>
                                    <Table striped bordered hover style={{ backgroundColor: "#196794" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: "#196794", color: "white" }}>Exercises</th>
                                                <th style={{ backgroundColor: "#196794", color: "white" }}>Sets</th>
                                                <th style={{ backgroundColor: "#196794", color: "white" }}>Repetitions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                    {workoutPlan.exercises.map((exercise, index) => (
                                                        <div key={index} style={{ marginBottom: "5px" }}>{exercise}</div>
                                                    ))}
                                                </td>
                                                <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                    {workoutPlan.sets.map((set, index) => (
                                                        <div key={index} style={{ marginBottom: "5px" }}>{set}</div>
                                                    ))}
                                                </td>
                                                <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                    {workoutPlan.repetitions.map((repetition, index) => (
                                                        <div key={index} style={{ marginBottom: "5px" }}>{repetition}</div>
                                                    ))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <LikeButton onClick={() => addWorkoutPlanLike(workoutPlan.id)} likes={workoutPlan.likes} />
                                        <Button onClick={() => handleShowComments(workoutPlan)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                            View Comments
                                        </Button>
                                    </div>
                                    <InputGroup className="mt-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[`workoutPlan_${workoutPlan.id}`] || ''}
                                            style={{ borderBlockColor: "#196794" }}
                                            onChange={e => handleWorkoutPlanCommentChange(workoutPlan.id, e.target.value)}
                                        />
                                        <Button variant="outline-secondary" onClick={() => addWorkoutPlanComment(workoutPlan.id)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                            Comment
                                        </Button>
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="d-flex justify-content-center">
                        <p>No workout plans available.</p>
                    </Col>
                )}
            </Row>
            {selectedWorkoutPlan && (
                <CommentsModal
                    show={showComments}
                    handleClose={handleCloseComments}
                    comments={selectedWorkoutPlan.comments}
                    updateComment={updateComment}
                    title={selectedWorkoutPlan.title}
                    deleteComment={handleDeleteComment} // Pass the deletion handler
                />
            )}
        </Container>
    );
}

export default UserProfileWorkoutPlans;
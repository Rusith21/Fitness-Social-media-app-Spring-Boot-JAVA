import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Table } from 'react-bootstrap';
import LikeButton from '../LikeButton';
import CommentsModal from '../CommentsModal';

function UserProfileWorkoutStatus({ workoutStatuses, setWorkoutStatuses, addWorkoutStatusLike, deleteWorkoutUpdateComment, addWorkoutStatusComment, handleWorkoutStatusCommentChange, newComment }) {

    const [showComments, setShowComments] = useState(false);
    const [selectedWorkoutUpdate, setSelectedWorkoutUpdate] = useState(null);

    const handleShowComments = (workoutStatus) => {
        setSelectedWorkoutUpdate(workoutStatus);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const updateComment = (commentId, updatedText) => {
        fetch(`http://localhost:8080/api/workout-updates/${selectedWorkoutUpdate.id}/comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: updatedText })
        })
        .then(response => response.json())
        .then(data => {
            // Refresh comments in the UI
            selectedWorkoutUpdate(prev => ({
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
            // Correct the function call to the properly passed down prop
            await deleteWorkoutUpdateComment(selectedWorkoutUpdate.id, commentId);
            
            // Remove the comment from the selectedWorkoutUpdate in the state directly
            const updatedComments = selectedWorkoutUpdate.comments.filter(comment => comment.id !== commentId);
            setSelectedWorkoutUpdate(prev => ({ ...prev, comments: updatedComments }));
            
            // Optionally, refetch comments or update the UI further based on the application's needs
    
        } catch (error) {
            console.error('Failed to delete the comment:', error);
            // Optionally, inform the user that the comment deletion failed
        }
    };    

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    };

    return (
        <Container>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ margin: "25px" }}>
                {Array.isArray(workoutStatuses) && workoutStatuses.length > 0 ? (
                    workoutStatuses.map(status => (
                        <Col key={status.id}>
                            <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px", backgroundColor: "#6CC0F1", color: "white" }}>
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold" style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "20px" }}>{status.title}</Card.Title>
                                    <Card.Text>{status.description}</Card.Text>
                                    <Card.Text>Posted By {status.userName}</Card.Text>
                                    <Card.Text>{formatTimestamp(status.timestamp)}</Card.Text>
                                    <Table striped bordered hover style={{ backgroundColor: "#196794" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: "#196794", color: "white" }}>Distance</th>
                                                    <th style={{ backgroundColor: "#196794", color: "white" }}>Pushups</th>
                                                    <th style={{ backgroundColor: "#196794", color: "white" }}>Weight Lifted</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {/* Display appropriate status values */}
                                                    <td style={{ backgroundColor: "#196794", color: "white" }}>{status.distance}</td>
                                                    <td style={{ backgroundColor: "#196794", color: "white" }}>{status.pushups}</td>
                                                    <td style={{ backgroundColor: "#196794", color: "white" }}>{status.weightLifted}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <LikeButton onClick={() => addWorkoutStatusLike(status.id)} likes={status.likes} />
                                        <Button onClick={() => handleShowComments(status)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                            View Comments
                                        </Button>
                                    </div>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[`workoutStatus_${status.id}`] || ''}
                                            onChange={e => handleWorkoutStatusCommentChange(status.id, e.target.value)}
                                            style={{ borderBlockColor: "#196794" }}
                                        />
                                        <Button variant="outline-secondary" onClick={() => addWorkoutStatusComment(status.id)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                            Comment
                                        </Button>
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="d-flex justify-content-center">
                        <p>No workout statuses available.</p>
                    </Col>
                )}
            </Row>
            {selectedWorkoutUpdate && (
                <CommentsModal
                    show={showComments}
                    handleClose={handleCloseComments}
                    comments={selectedWorkoutUpdate.comments}
                    updateComment={updateComment}
                    deleteComment={handleDeleteComment}
                    title={selectedWorkoutUpdate.title}
                />
            )}
        </Container>
    );
}

export default UserProfileWorkoutStatus;
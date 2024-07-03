import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, Modal, Table } from 'react-bootstrap'; // Import Table from react-bootstrap
import LikeButton from './LikeButton';

function ViewWorkoutStatus({ workoutStatuses, handleWorkoutStatusCommentChange, addWorkoutStatusComment, newComment, deleteWorkoutUpdateComment, addWorkoutStatusLike }) {
    const [selectedWorkoutStatus, setSelectedWorkoutStatus] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleShowComments = (status) => {
        setSelectedWorkoutStatus(status);
        setShowComments(true);
    };

    const handleDeleteComment = (workoutUpdateId, commentId) => {
        deleteWorkoutUpdateComment(workoutUpdateId, commentId);
        // Update the selectedWorkoutPlan state locally to reflect this change
        const updatedComments = selectedWorkoutStatus.comments.filter(comment => comment.id !== commentId);
        setSelectedWorkoutStatus(prev => ({
            ...prev,
            comments: updatedComments
        }));
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    };

    return (
        <React.Fragment>
            <div style={{ overflowX: 'auto', maxWidth: '100vw', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: `${workoutStatuses.length * 420}px` }}>
                    {Array.isArray(workoutStatuses) && workoutStatuses.length > 0 ? (
                        workoutStatuses.map((status, index) => (
                            <div key={status.id} style={{ flex: '0 0 auto', marginRight: '20px' }}>
                                <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "400px", backgroundColor: "#6CC0F1", color: "white" }}>
                                    <Card.Body>
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
                                            <Button onClick={() => handleShowComments(status)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>View Comments</Button>
                                        </div>
                                        <InputGroup className="mb-3" style={{ marginTop: "25px" }}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={newComment[`workoutStatus_${status.id}`] || ''}
                                                onChange={e => handleWorkoutStatusCommentChange(status.id, e.target.value)}
                                                style={{ border: 0 }}
                                            />
                                            <Button variant="outline-secondary" onClick={() => addWorkoutStatusComment(status.id)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                                Comment
                                            </Button>
                                        </InputGroup>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center">
                            <p>No workout statuses available.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedWorkoutStatus && (
                <Modal show={showComments} onHide={handleCloseComments} centered>
                    <Modal.Header closeButton style={{ backgroundColor: "#196794", color: "white" }}>
                        <Modal.Title>Comments for {selectedWorkoutStatus.description}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#196794", color: "white" }}>
                        {selectedWorkoutStatus.comments.map((comment, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center">
                            <p key={index}>{comment.userName} : {comment.text}</p>
                            <Button variant="danger" onClick={() => handleDeleteComment(selectedWorkoutStatus.id, comment.id)}>Delete</Button>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#196794", color: "white" }}>
                        <Button variant="secondary" onClick={handleCloseComments} style={{ backgroundColor: "#6CC0F1", color: "white", border: 0 }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </React.Fragment>
    );
}

export default ViewWorkoutStatus;
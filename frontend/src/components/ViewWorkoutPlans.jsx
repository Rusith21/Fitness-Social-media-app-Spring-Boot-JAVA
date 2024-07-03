import React, { useState } from 'react';
import { Container, Card, Button, Form, InputGroup, Row, Col, Modal, Table } from 'react-bootstrap';
import LikeButton from './LikeButton';

function ViewWorkoutPlans({ workoutPlans, handleWorkoutPlanCommentChange, addWorkoutPlanComment, deleteWorkoutPlanComment, newComment, addWorkoutPlanLike }) {
    const [showComments, setShowComments] = useState(false);
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);

    const handleShowComments = (workoutPlan) => {
        setSelectedWorkoutPlan(workoutPlan);
        setShowComments(true);
    };

    const handleDeleteComment = (workoutPlanId, commentId) => {
        deleteWorkoutPlanComment(workoutPlanId, commentId);
        // Update the selectedWorkoutPlan state locally to reflect this change
        const updatedComments = selectedWorkoutPlan.comments.filter(comment => comment.id !== commentId);
        setSelectedWorkoutPlan(prev => ({
            ...prev,
            comments: updatedComments
        }));
    };    

    const handleCloseComments = () => {
        setShowComments(false);
    };

    return (
        <React.Fragment>
            <Container className="d-flex justify-content-center">
                <Row xs={1} md={1} lg={1} className="g-4" style={{ width: "67%", marginTop: "25px" }}>
                    {Array.isArray(workoutPlans) && workoutPlans.length > 0 ? (
                        workoutPlans.map(workoutPlan => (
                            <Col key={workoutPlan.id}>
                                <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px", backgroundColor: "#6CC0F1", color: "white" }}>
                                    <Card.Body>
                                        <Card.Title className="fw-bold" style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "20px" }}>{workoutPlan.title}</Card.Title>
                                        <Card.Text>{workoutPlan.description}</Card.Text>
                                        <Card.Text>Posted By {workoutPlan.userName}</Card.Text>
                                        <Table striped bordered hover style={{backgroundColor: "#196794"}}>
                                            <thead>
                                                <tr>
                                                    <th style={{backgroundColor: "#196794", color: "white"}}>Exercises</th>
                                                    <th style={{backgroundColor: "#196794", color: "white"}}>Sets</th>
                                                    <th style={{backgroundColor: "#196794", color: "white"}}>Repetitions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{backgroundColor: "#196794", color: "white"}}>
                                                        {workoutPlan.exercises && workoutPlan.exercises.map((exercise, index) => (
                                                            <div key={index} style={{ marginBottom: "5px" }}>{exercise}</div>
                                                        ))}
                                                    </td>
                                                    <td style={{backgroundColor: "#196794", color: "white"}}>
                                                        {workoutPlan.sets && workoutPlan.sets.map((set, index) => (
                                                            <div key={index} style={{ marginBottom: "5px" }}>{set}</div>
                                                        ))}
                                                    </td>
                                                    <td style={{backgroundColor: "#196794", color: "white"}}>
                                                        {workoutPlan.repetitions && workoutPlan.repetitions.map((repetition, index) => (
                                                            <div key={index} style={{ marginBottom: "5px" }}>{repetition}</div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <LikeButton onClick={() => addWorkoutPlanLike(workoutPlan.id)} likes={workoutPlan.likes} />
                                            <Button onClick={() => handleShowComments(workoutPlan)} style={{backgroundColor: "#196794", color: "white", border: 0}}>
                                                View Comments
                                            </Button>
                                        </div>
                                        <InputGroup className="mt-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={newComment[`workoutPlan_${workoutPlan.id}`] || ''}
                                                style={{borderBlockColor: "#196794"}}
                                                onChange={e => handleWorkoutPlanCommentChange(workoutPlan.id, e.target.value)}
                                            />
                                            <Button variant="outline-secondary" onClick={() => addWorkoutPlanComment(workoutPlan.id)} style={{backgroundColor: "#196794", color: "white", border: 0}}>
                                                Comment
                                            </Button>
                                        </InputGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>No workout plans available.</p>
                        </Col>
                    )}
                </Row>
            </Container>
            {selectedWorkoutPlan && (
                <Modal show={showComments} onHide={handleCloseComments} centered>
                    <Modal.Header closeButton style={{backgroundColor: "#196794", color: "white"}}>
                        <Modal.Title>Comments for {selectedWorkoutPlan.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{backgroundColor: "#196794", color: "white"}}>
                        {selectedWorkoutPlan.comments.map((comment, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center">
                            <p key={index}>{comment.userName} : {comment.text}</p>
                            <Button variant="danger" onClick={() => handleDeleteComment(selectedWorkoutPlan.id, comment.id)}>Delete</Button>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer style={{backgroundColor: "#196794", color: "white"}}>
                        <Button variant="secondary" onClick={handleCloseComments} style={{backgroundColor: "#6CC0F1", color: "white", border: 0}}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </React.Fragment>
    );
}

export default ViewWorkoutPlans;
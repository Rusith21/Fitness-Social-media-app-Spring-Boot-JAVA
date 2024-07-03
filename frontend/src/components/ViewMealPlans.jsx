import React, { useState } from 'react';
import { Container, Card, Button, Form, InputGroup, Row, Col, Modal, Table } from 'react-bootstrap';
import LikeButton from './LikeButton';

function ViewMealPlans({ mealPlans, handleMealPlanCommentChange, addMealPlanComment, newComment, addMealPlanLike, deleteMealPlanComment }) {
    const [showComments, setShowComments] = useState(false);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);

    const handleShowComments = (mealPlan) => {
        setSelectedMealPlan(mealPlan);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const handleDeleteComment = (mealPlanId, commentId) => {
        deleteMealPlanComment(mealPlanId, commentId);
        // Update the selectedMealPlan state locally to reflect this change
        const updatedComments = selectedMealPlan.comments.filter(comment => comment.id !== commentId);
        setSelectedMealPlan(prev => ({
            ...prev,
            comments: updatedComments
        }));
    };

    return (
        <React.Fragment>
            <Container className="d-flex justify-content-center">
                <Row xs={1} md={1} lg={1} className="g-4" style={{ width: "67%", marginTop: "25px", marginBottom: "25px" }}>
                    {Array.isArray(mealPlans) && mealPlans.length > 0 ? (
                        mealPlans.map(mealPlan => (
                            <Col key={mealPlan.id}>
                                <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px", backgroundColor: "#6CC0F1", color: "white" }}>
                                    <Card.Body>
                                        <Card.Title className="fw-bold" style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "20px" }}>{mealPlan.title}</Card.Title>
                                        <div>
                                            {mealPlan.imageUrls && mealPlan.imageUrls.map((imageUrl, index) => (
                                                <img key={index} src={imageUrl} alt=""
                                          style={{ width: "100%", marginBottom: "10px" }} />
                                            ))}
                                        </div>
                                        <p style={{ marginBottom: "20px", fontSize: "1rem" }}>{mealPlan.description}</p>
                                       
                                       
                                        <p style={{ marginBottom: "20px", fontSize: "1rem" }}>Posted By {mealPlan.userName}</p>
                                        <Table striped bordered hover style={{backgroundColor: "#196794"}}>
                                            <thead>
                                                <tr>
                                                    <th>Ingredients</th>
                                                    <th>Nutritional Information</th>
                                                    <th>Portion Sizes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {mealPlan.ingredients.map((ingredient, index) => (
                                                            <div key={index}>{ingredient}</div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {mealPlan.nutritionalInfo.map((info, index) => (
                                                            <div key={index}>{info}</div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {mealPlan.portionSizes.map((portion, index) => (
                                                            <div key={index}>{portion}</div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <LikeButton onClick={() => addMealPlanLike(mealPlan.id)} likes={mealPlan.likes} />
                                            <Button onClick={() => handleShowComments(mealPlan)}>View Comments</Button>
                                        </div>
                                        <InputGroup className="mt-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={newComment[`mealPlan_${mealPlan.id}`] || ''}
                                                onChange={e => handleMealPlanCommentChange(mealPlan.id, e.target.value)}
                                            />
                                            <Button onClick={() => addMealPlanComment(mealPlan.id)}>Comment</Button>
                                        </InputGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>No meal plans available.</p>
                        </Col>
                    )}
                </Row>
            </Container>
            {selectedMealPlan && (
                <Modal show={showComments} onHide={handleCloseComments} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Comments for {selectedMealPlan.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedMealPlan.comments.length > 0 ? selectedMealPlan.comments.map((comment, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center">
                                <p>{comment.userName}: {comment.text}</p>
                                <Button variant="danger" onClick={() => handleDeleteComment(selectedMealPlan.id, comment.id)}>Delete</Button>
                            </div>
                        )) : <p>No comments to display.</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseComments}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </React.Fragment>
    );
}

export default ViewMealPlans;
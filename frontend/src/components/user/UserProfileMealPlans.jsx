import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Table } from 'react-bootstrap';
import LikeButton from '../LikeButton';
import CommentsModal from '../CommentsModal';

function UserProfileMealPlans({ mealPlans, addMealPlanLike, addMealPlanComment, handleMealPlanCommentChange, deleteMealPlanComment, newComment }) {
    const [showComments, setShowComments] = useState(false);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);

    const handleShowComments = (mealPlan) => {
        setSelectedMealPlan(mealPlan);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
        setSelectedMealPlan(null); // Clear selected meal plan on close
    };

    // Add this function in the same component or context managing your API calls
    const updateComment = (commentId, updatedText) => {
        fetch(`http://localhost:8080/api/meal-plans/${selectedMealPlan.id}/comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: updatedText })
        })
        .then(response => response.json())
        .then(data => {
            // Refresh comments in the UI
            setSelectedMealPlan(prev => ({
                ...prev,
                comments: prev.comments.map(comment =>
                    comment.id === commentId ? { ...comment, text: updatedText } : comment
                )
            }));
        })
        .catch(error => console.error('Error updating comment:', error));
    };

    const handleDeleteComment = (commentId) => {
        deleteMealPlanComment(selectedMealPlan.id, commentId)
        .then(() => {
            // Assuming `deleteMealPlanComment` function returns a promise
            // Refresh the comments by updating the state
            const updatedMealPlans = mealPlans.map(mealPlan => {
                if (mealPlan.id === selectedMealPlan.id) {
                    // Filter out the deleted comment
                    const filteredComments = mealPlan.comments.filter(comment => comment.id !== commentId);
                    return {...mealPlan, comments: filteredComments};
                }
                return mealPlan;
            });
            setSelectedMealPlan(prev => ({ ...prev, comments: updatedMealPlans.find(mp => mp.id === selectedMealPlan.id).comments }));
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
        });
    };    

    if (!Array.isArray(mealPlans) || mealPlans.length === 0) {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <Card className="p-4 my-4">
                            <Card.Body className="text-center">
                                <p>No meal plans available.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row xs={1} md={1} lg={1} className="g-4" style={{ margin: "25px" }}>
                {mealPlans.map(mealPlan => (
                    <Col key={mealPlan.id}>
                        <Card className="h-100" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px", backgroundColor: "#6CC0F1", color: "white" }}>
                            <Card.Body className="text-center">
                                <Card.Title className="fw-bold" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>{mealPlan.title}</Card.Title>
                                <p style={{ marginBottom: "20px", fontSize: "1rem" }}>{mealPlan.description}</p>
                                <p style={{ marginBottom: "20px", fontSize: "1rem" }}>Posted By {mealPlan.userName}</p>
                                <Table striped bordered hover style={{ backgroundColor: "#196794" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: "#196794", color: "white" }}>Ingredients</th>
                                            <th style={{ backgroundColor: "#196794", color: "white" }}>Nutritional Information</th>
                                            <th style={{ backgroundColor: "#196794", color: "white" }}>Portion Sizes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                {mealPlan.ingredients.map((ingredient, index) => (
                                                    <div key={index} style={{ marginBottom: "5px" }}>{ingredient}</div>
                                                ))}
                                            </td>
                                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                {mealPlan.nutritionalInfo && mealPlan.nutritionalInfo.map((info, index) => (
                                                    <div key={index} style={{ marginBottom: "5px" }}>{info}</div>
                                                ))}
                                            </td>
                                            <td style={{ backgroundColor: "#196794", color: "white" }}>
                                                {mealPlan.portionSizes && mealPlan.portionSizes.map((portion, index) => (
                                                    <div key={index} style={{ marginBottom: "5px" }}>{portion}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <LikeButton onClick={() => addMealPlanLike(mealPlan.id)} likes={mealPlan.likes} />
                                    <Button onClick={() => handleShowComments(mealPlan)} style={{ backgroundColor: "#196794", color: "white", border: 0 }}>
                                        View Comments
                                    </Button>
                                </div>
                                <InputGroup className="mt-3">
                                    <Form.Control
                                        style={{ borderBlockColor: "#196794" }}
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment[`mealPlan_${mealPlan.id}`] || ''}
                                        onChange={e => handleMealPlanCommentChange(mealPlan.id, e.target.value)}
                                    />
                                    <Button variant="outline-secondary" onClick={() => addMealPlanComment(mealPlan.id)} style={{ backgroundColor: "#196794", color: "white" }}>
                                        Comment
                                    </Button>
                                </InputGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {selectedMealPlan && (
                <CommentsModal
                    show={showComments}
                    handleClose={handleCloseComments}
                    comments={selectedMealPlan.comments}
                    updateComment={updateComment}
                    title={selectedMealPlan.title}
                    deleteComment={handleDeleteComment} // Pass the deletion handler
                />
            )}
        </Container>
    );
}

export default UserProfileMealPlans;
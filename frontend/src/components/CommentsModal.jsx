import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CommentsModal({ show, handleClose, comments, title, updateComment, deleteComment }) {
    const [editCommentId, setEditCommentId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEditComment = (comment) => {
        setEditCommentId(comment.id);
        setEditText(comment.text);
    };

    const handleSaveEdit = (commentId) => {
        updateComment(commentId, editText);
        setEditCommentId(null);
        setEditText('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton style={{backgroundColor: "#196794", color: "white"}}>
                <Modal.Title>Comments for {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: "#196794", color: "white"}}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="d-flex justify-content-between align-items-center mb-2">
                            {editCommentId === comment.id ? (
                                <Form.Control
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                            ) : (
                                <p>{comment.userName}: {comment.text}</p>
                            )}
                            <div>
                                {editCommentId === comment.id ? (
                                    <Button variant="success" onClick={() => handleSaveEdit(comment.id)}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleEditComment(comment)}>
                                        Edit
                                    </Button>
                                )}
                                <Button variant="danger" onClick={() => deleteComment(comment.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments to display.</p>
                )}
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: "#196794", color: "white"}}>
                <Button variant="secondary" onClick={handleClose} style={{backgroundColor: "#6CC0F1", color: "white", border: 0}}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CommentsModal;
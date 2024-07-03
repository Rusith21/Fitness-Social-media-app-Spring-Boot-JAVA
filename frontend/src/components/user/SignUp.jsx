import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import signInImage from '../../../src/signinimage.png'; // Assuming the image file is in the same directory

function SignUp() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/signup', userData);
            console.log(response.data);
            alert('Registration successful');
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('User already exist');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Card style={{ width: '40rem', margin: "87px", backgroundColor: "#196794", border: 0, color: "white" }}>
                <Card.Body className="d-flex">
                    <Row>
                        <Col xs={6} className="d-flex justify-content-center align-items-center p-4">
                            <img src={signInImage} alt="Sign In" style={{ height: '250px', width: '400px' }} />
                        </Col>
                        <Col xs={6} className="p-3">
                            <Card.Title className="text-center mb-4">Sign Up</Card.Title>
                            <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" style={{backgroundColor: "#6CC0F1", border: 0}}>
                                    Sign Up
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                Already have an account? <Link to="/" style={{color: "#6CC0F1"}}>Sign In</Link>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignUp;
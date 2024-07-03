import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Col, Row } from 'react-bootstrap';
import instagramLogo from '../../../src/signinimage.png';
import { useUser } from './UserContext';

function SignIn() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/signin', credentials);
            console.log(response.data);
            updateUser(response.data);
            localStorage.setItem('userId', response.data.id);
            navigate('/home');
        } catch (error) {
            console.error('Sign-in failed:', error);
            alert('Please check email and password');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Card style={{ width: '700px', height: "378px", margin: "70px", backgroundColor: "#196794", border: 0, color: "white" }}>
                <Card.Body className="d-flex">
                    <Row>
                    <Col xs={6} className="d-flex justify-content-center align-items-center p-4">
                            <img src={instagramLogo} alt="Sign In" style={{ height: '250px', width: '400px' }} />
                        </Col>
                        <Col xs={6} className="p-3">
                            <Card.Title className="text-center mb-4">Sign In</Card.Title>
                            <Form onSubmit={handleSubmit} style={{textAlign: "center"}}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" style={{backgroundColor: "#6CC0F1", border: 0}}>
                                    Sign In
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                Don't have an account? <a href="/signup" style={{color: "#6CC0F1"}}>Sign up</a>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignIn;
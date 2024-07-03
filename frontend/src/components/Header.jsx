import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useUser } from './user/UserContext';
import { Container } from 'react-bootstrap';
import './Header.css';

function Header() {
    const { user, userId, name, setUser } = useUser();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('name');
        if (storedUserId) {
            setUser({ id: storedUserId });
            console.log("Header userID: " + storedUserId);
            console.log("Header Name: " + storedName);
        }
    }, [setUser]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        navigate('/');
    };

    return (
        <Container fluid className="p-0">
            <Navbar expand="lg" className="px-3 justify-content-center" style={{backgroundColor: "#1097e6"}}>
                <Navbar.Brand as={NavLink} to="/home" className="d-flex align-items-center">
                    <span className="ms-2" style={{color: "white"}}>Fitness App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto justify-content-center">
                        <NavDropdown
                            title={<><i className="bi bi-plus"></i> Create</>}
                            id="navbarScrollingDropdown"
                            show={showDropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <NavDropdown.Item as={NavLink} to="/add-workout-plan">
                                <i className="bi bi-plus"></i> Create Workout Plan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/create-meal-plan">
                                <i className="bi bi-plus"></i> Create Meal Plan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/add-workout-status">
                                <i className="bi bi-plus"></i> Create Workout Status
                            </NavDropdown.Item>
                        </NavDropdown>
                        {user ? (
                            <NavDropdown title={`${name || 'User'}`} id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to={`/user-profile/${userId}`}>My Profile</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to={`/user-meal-plans/${userId}`}>My Meal Plans</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to={`/user-workout-plans/${userId}`}>My Workout Plans</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to={`/user-workout-status/${userId}`}>My Workout Status</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Item>
                                <NavLink to="/" className="nav-link">Sign In</NavLink>
                            </Nav.Item>
                        )}
                        {user && (
                            <NavDropdown title="Logout" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
}

export default Header;
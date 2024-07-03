import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('name');

        if (storedUserId && storedName) {
            setUserId(storedUserId);
            setName(storedName);
        } else {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user');
            const userData = response.data;
            setUser(userData.user);
            setUserId(userData.userId);
            setName(userData.name);
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('name', userData.name);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const updateUser = (userData) => {
        setUser(userData.user);
        setUserId(userData.userId);
        setName(userData.name);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('name', userData.name);
    };

    return (
        <UserContext.Provider value={{ user, setUser, userId, setUserId, name, setName, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
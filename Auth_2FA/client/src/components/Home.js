import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Welcome to the Home Page</h2>
            <p>You are successfully authenticated!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
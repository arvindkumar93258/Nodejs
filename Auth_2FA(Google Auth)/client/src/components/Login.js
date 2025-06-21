import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [partialToken, setPartialToken] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/login', {
                email,
                password
            });

            if (response.data.requires2FA) {
                // Use navigate function instead of Navigate component
                navigate('/verify-2fa-login', {
                    state: {
                        partialToken: response.data.partialToken,
                        email: email // Pass email too for better UX
                    }
                });
            } else {
                localStorage.setItem('token', response.data.token);
                navigate('/home');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
            <p>
                <a href="/disable-2fa">Disable 2FA</a>
            </p>
        </div>
    );
};

export default Login;
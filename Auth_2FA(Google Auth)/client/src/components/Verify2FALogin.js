import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';



export default function Verify2FALogin() {

    const [token, setToken] = useState();
    const [message, setMessage] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const partialToken = location.state?.partialToken || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/verify-2fa', {
                partialToken,
                token
            });

            // Save token to localStorage and redirect to home
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error verifying 2FA token');

        }
    }
    return (
        <div>

            <h2>Verify Two-Factor Authentication</h2>
            <p>Enter the 6-digit code from your authenticator app</p>

            <form onSubmit={handleSubmit} >

                <label>6-digit code:</label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}
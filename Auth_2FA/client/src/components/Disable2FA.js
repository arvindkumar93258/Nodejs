import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Disable2FA = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/disable-2fa', {
        email,
        password
      });
      setMessage(response.data.message);
      // Redirect to login after disabling 2FA
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error disabling 2FA');
    }
  };

  return (
    <div>
      <h2>Disable Two-Factor Authentication</h2>
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
        <button type="submit">Disable 2FA</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  );
};

export default Disable2FA;
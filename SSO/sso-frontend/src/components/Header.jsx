import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/auth/current', {
          withCredentials: true
        });
        setUser(data);
        if (data) navigate('/dashboard');
      } catch (err) {
        console.log('Not authenticated', err);
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="home">
      <h1>Welcome to Our App</h1>
      {!user && (
        <div className="auth-section">
          <h2>Please login to continue</h2>
          <GoogleLoginButton />
        </div>
      )}
    </div>
  );
}
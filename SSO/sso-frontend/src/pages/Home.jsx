import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Only check auth when component mounts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/auth/current', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    navigate('/dashboard');
                }
            } catch (error) {
                console.log(error);

                console.log('Not authenticated');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
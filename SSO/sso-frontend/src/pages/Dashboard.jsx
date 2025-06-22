import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/auth/current', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Not authenticated');
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.log(error);
                navigate('/');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        await fetch('http://localhost:5001/api/auth/logout', {
            credentials: 'include'
        });
        navigate('/');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <h1>Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
            <img src={user.avatar} alt="Profile" width="100" />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
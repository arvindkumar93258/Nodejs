import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


export default function Dashboard() {

    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem("username")) {
                navigate("/");
            }
        };
        checkUser();
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem("username");
        navigate("/");
    }
    return (
        <div>

            <h2>Hello, David</h2>

            <button onClick={handleSignOut}> Log Out</button>


        </div>
    )
}

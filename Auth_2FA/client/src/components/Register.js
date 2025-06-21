
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';           // ← correct import



export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(email, password, message);
        try {
            console.log("Calling the register API");
            // axios.post is now a function…
            const response = await axios.post(
                'http://localhost:5001/api/register',
                { email, password }
            );
            console.log("API response:", response);
            setMessage(response.data.message);
            navigate('/setup-2fa', { state: { email } });
        } catch (error) {
            console.error("Error got: ", error);
            setMessage(error.response?.data?.message || 'Error registering user');
        }
    };
    return (
        <div
            style={{
                width: "400px",
                height: "300px",
                "alignItems": "center",

            }}
        >
            <h2
                style={{
                    textAlign: "center",

                }}
            >Register</h2>
            <form onSubmit={handleSubmit}>

                <label style={{
                    padding: "5px",
                    margin: "5px"
                }}>Email</label>
                <input
                    style={{
                        width: "100%",
                        padding: "8px",
                        margin: "5px 10px",

                    }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                />

                <label style={{
                    padding: "5px",
                    margin: "5px"
                }}>Password</label>
                <input
                    style={{
                        width: "100%",
                        padding: "8px",
                        margin: "5px 10px",

                    }}
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    style={{
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "8px",
                        color: "blue",
                        backgroundColor: "gray",
                        "padding": "8px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        margin: "10px",
                        font: "inherit",
                        display: "block",
                        width: "60%"
                    }}
                    type="submit"
                ><span style={{ fontSize: "16px", color: "" }}>Register</span></button>

            </form>
            {message && <p>{message}</p>}
            <p>
                Already have an account?&nbsp;&nbsp;<a href="/login">Login</a>
            </p>

        </div>
    )
}
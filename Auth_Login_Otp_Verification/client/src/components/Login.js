import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const postLoginDetails = () => {
        fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json()).then(data => {
            if (data.error_message) {
                alert(data.error_message);
            } else {
                console.log(data.data);
                localStorage.setItem("username", data.data.username);
                navigate("/phone/verify");
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);
        postLoginDetails();
        setPassword("");
        setEmail("");
    };
    const gotoSignUpPage = () => navigate("/register");


    return (
        <div
            style={{
                margin: "auto",
                height: "280px",
                width: "400px",
                border: "2px solid0red"


            }}
        >
            <h2 style={{
                margin: "4px", padding: "4px",
                textAlign: "center",
                alignItems: "center"
            }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <label style={{
                    margin: "auto",
                    display: "block"
                }}>Username</label>
                <input
                    style={{
                        padding: "4px 5px",
                        margin: "8px 0",
                        border: "1px solid #ccc",
                        display: "inline-block",
                        "border-radius": "4px",
                        "box-sizing": "border-box",
                        width: "100%"
                    }}
                    type="text"
                    placeholder="Username/Email"
                    name="email"
                    value={email}
                    required
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <label style={{
                    margin: "auto",
                    display: "block"
                }}>Password</label>
                <input
                    style={{
                        padding: "4px 5px",
                        margin: "8px 0",
                        border: "1px solid #ccc",
                        display: "inline-block",
                        "border-radius": "4px",
                        "box-sizing": "border-box",
                        width: "100%"
                    }}
                    placeholder="Password"
                    type="password"
                    name="password"
                    id="password"
                    minLength={8}
                    onChange={e => { setPassword(e.target.value) }}
                />

                <button style={{
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
                    display: "block"
                }}>Sign-in</button>

                <p>
                    Don't have an account?{" "}
                    <span style={{
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "4px",
                        color: "blue",
                        backgroundColor: "gray",
                        "padding": "8px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        margin: "10px"
                    }} onClick={gotoSignUpPage}>
                        Sign up
                    </span>
                </p>

            </form>
        </div>
    )
}
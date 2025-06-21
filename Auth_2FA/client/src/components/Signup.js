import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function SignUp() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const goToLoginPage = () => navigate("/")

    const postSignUpDetails = () => {
        fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                phone,
                username,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json()).then(data => {
            if (data.error_message) {
                alert(data.error_message);
            } else {
                alert(data.message);
                navigate("/");
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        postSignUpDetails();
        console.log({ email, username, phone, password });
        setEmail("");
        setPhone("");
        setUsername("");
        setPassword("");
    };


    return (
        <div
            style={{
                margin: "auto",
                height: "450px",
                width: "400px",
                border: "2px solid0red"
            }}
        >

            <h2
                style={{
                    textAlign: "center"
                }}
            >Sign Up</h2>

            <form onSubmit={handleSubmit} >

                <label >Email</label>
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
                    type="email"
                    id="email"
                    placeholder="Email"
                    name="email"
                    required
                    onChange={e => { setEmail(e.target.value) }}
                />

                <label >Username</label>
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
                    id="username"
                    placeholder="Username"
                    name="username"
                    required
                    onChange={e => { setUsername(e.target.value) }}
                />
                <label >Phone Number</label>
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
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    name="phone"
                    required
                    onChange={e => { setPhone(e.target.value) }}
                />
                <label >Password</label>
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
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    minLength={8}
                    onChange={e => { setPassword(e.target.value) }}
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
                        display: "block"
                    }}
                >Submit</button>
                <p>Already have an account ? {" "}</p>
                <span
                    style={{
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "4px",
                        color: "blue",
                        backgroundColor: "gray",
                        "padding": "8px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        margin: "10px"
                    }}
                    onClick={goToLoginPage}>Login</span>
            </form>


        </div>
    )

}
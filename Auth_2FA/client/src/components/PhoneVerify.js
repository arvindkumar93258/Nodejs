import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function PhoneVerify() {

    const [code, setCode] = useState();
    const navigate = useNavigate();

    const otpVerification = () => {
        try {
            fetch("http://localhost:4000/api/auth/otp-verification", {
                method: "POST",
                body: JSON.stringify({
                    otp: code
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                if (data.error_message) {
                    alert(data.error_message);
                    navigate("/phone/verify");
                } else {
                    alert("Logged in Successfully");
                    //👇🏻 Navigates to the dashboard page
                    navigate("/dashboard");
                }
            })
        } catch (error) {
            alert(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ code });
        otpVerification();
        setCode("");
        // navigate("/dashboard");
    };


    return (
        <div
            style={{
                margin: "auto",
                height: "200px",
                width: "400px",
                border: "2px solid0red"
            }}
        >

            <h2
                style={{
                    textAlign: "center"
                }}
            >Verify your phone number</h2>
<div
style={{
    alignItems: "center"
}}
>


            <form
                style={{
                    alignItems: "center"
                }}
            onSubmit={handleSubmit} >

                <label
                    style={{
                        margin: "10px 20px"
                    }}
                >Phone Code</label>
                <input
                    style={{
                        padding: "8px 10px",
                        margin: "8px 4px",
                        border: "1px solid #ccc",
                        display: "inline-block",
                        "border-radius": "4px",
                        "box-sizing": "border-box",
                        width: "120px"
                    }}
                    type="number"
                    name="code"
                    id="code"
                    placeholder="OTP"
                    value={code}
                    onChange={e => setCode(e.target.value)}
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
                        width: "100%"
                    }}
                    >Authenticate</button>
            </form>
            </div>
        </div>
    )
}
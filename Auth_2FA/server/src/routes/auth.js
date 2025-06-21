const express = require("express");
const router = express.Router();
const { users } = require("./Users.json");


const generateId = () => Math.random().toString(36).substring(2, 10);

router.post("/register", async (req, res) => {
    const { email, phone, username, password } = req.body;
    console.log(email, phone, username, password);
    if (!email || email.length < 4) {
        return res.status(400).json({ message: "Invalid Email" });
    }
    const result = users.filter(user => user.email == email);

    if (!result.length) {
        const newUser = {
            id: generateId(),
            email,
            password,
            phone,
            username
        };
        users.push(newUser);
        return res.status(201).json({
            message: "Account created successfully!",
        });
    } else {

        res.json({
            error_message: "User already exists",
        });
    }
    // return res.status(200).json({ status: "success" });
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({
            message: "email and password are required!"
        });
    }

    const result = users.filter(user => user.email == email && user.password == password);
    if (!result.length) {
        return res.json({
            error_message: "Invalid credentials",
        });
    } else {

        res.status(200).json({
            message: "Login successfully",
            data: {
                username: result[0].username,
            },
        });
    }
    // return res.status(200).json({ status: "success" });
})

router.post("/otp-verification", async (req, res) => {
    try {
        const { otp } = req.body;
        if (otp == "111222") {
            return res.status(200).json({
                message: "Logged in successfully"
            });
        } else {
            return res.json({
                error_message: "Invalid otp",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post("/signout", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    return res.status(200).json({ status: "success" });
})

module.exports = router;

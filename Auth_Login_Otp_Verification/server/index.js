//index.js
"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const router = require("./src/routes");
app.use("/api", router);
app.get("/health-check", (req, res) => {
    return res.status(200).json({ message: "healthy"});
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

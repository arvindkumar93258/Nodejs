const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const connectMongoDB = require('./db');
const apiRouter = require("./routes")


const app = express();
// before any routes:
app.use(cors({
  origin: 'http://localhost:3000',  // your React dev URL
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`☞ ${req.method} ${req.url}`, req.body);
    next();
});

app.use("/api", apiRouter);


// Health check routes
app.use(express.json()); // includes bodyParser.json
app.get("/", (req, res) => {
    return res.status(200).json({ message: "ok" })
})

app.get("/health", (req, res) => res.send("OK"));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    await connectMongoDB();
    console.log(`Server running on port ${PORT}`);
});

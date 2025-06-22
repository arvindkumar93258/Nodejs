const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use((req, res, next) => {
    console.log(`☞ ${req.method} ${req.url}`, req.body);
    next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// Add this to app.js before your routes
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Cookies:', req.cookies);
    next();
});

// Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users')); // Example additional route
// app.use('/api/orders', require('./routes/orders')); // Example additional route

module.exports = app;

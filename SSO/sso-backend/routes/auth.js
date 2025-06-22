const express = require('express');
const passport = require('passport');
const router = express.Router();


// In routes/auth.js
router.get('/google', (req, res, next) => {
    console.log('Initiating Google OAuth...'); // Debug log
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account' // Force account selection
    })(req, res, next);
});

router.get('/google/callback',
    (req, res, next) => {
        console.log('Google callback received'); // Debug log
        passport.authenticate('google', {
            failureRedirect: '/login',
            successRedirect: process.env.FRONTEND_URL
        })(req, res, next);
    }
);

// Get current user
router.get('/current', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    res.json(req.user);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
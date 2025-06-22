const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// In config/passport.js
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true
},
    (req, accessToken, refreshToken, profile, done) => {
        // Add debug logging
        console.log('Google profile:', profile);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

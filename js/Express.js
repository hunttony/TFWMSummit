const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

// Configure session middleware
app.use(session({ secret: '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', resave: true, saveUninitialized: true }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Replace these with your actual client ID and client secret
const GOOGLE_CLIENT_ID = '455160873419-4fi9gld53aidfpfeanccmm8ptt0aga3n.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback', // Replace with your callback URL
},
(accessToken, refreshToken, profile, done) => {
    // This function will be called after successful authentication.
    // You can save the user's profile and tokens in a database.
    return done(null, profile);
}));

// Serialize and deserialize user (for session management)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Define your routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/gmail.send'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/welcome'); // Redirect to a welcome page or another route
    }
);

app.get('/welcome', (req, res) => {
    if (req.isAuthenticated()) {
        // The user is authenticated, you can access req.user to get user information
        res.send(`Welcome, ${req.user.displayName}!`);
    } else {
        // Not authenticated, redirect to the login page
        res.redirect('/');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

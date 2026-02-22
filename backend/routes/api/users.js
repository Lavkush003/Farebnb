const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const passport = require("passport");
const wrapAsync = require("../../utils/wrapAsync.js");

// GET /api/users/google - Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GET /api/users/google/callback - Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login?error=auth_failed" }),
    (req, res) => {
        // Successful authentication, redirect to frontend home
        res.redirect("http://localhost:5173/");
    }
);

// GET /api/users/current - Get currently logged-in user
router.get("/current", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.json(null);
    }
});

// POST /api/users/signup - Register a new user
router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);

            res.status(201).json({
                _id: registeredUser._id,
                username: registeredUser.username,
                email: registeredUser.email,
                message: "Signup successful, please login."
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    })
);

// POST /api/users/login - Log in a user
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: "Authentication error" });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || "Invalid credentials" });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ error: "Login failed" });
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        });
    })(req, res, next);
});

// POST /api/users/logout - Log out
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;

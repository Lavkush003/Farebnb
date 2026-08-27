const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user.js");
const inMemoryStore = require("../../models/inMemoryStore.js");
const passport = require("passport");
const wrapAsync = require("../../utils/wrapAsync.js");

// GET /api/users/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GET /api/users/google/callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=auth_failed" }),
    (req, res) => {
        const frontendUrl = process.env.FRONTEND_URL || "/";
        res.redirect(frontendUrl);
    }
);

// GET /api/users/current
router.get("/current", wrapAsync(async (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.user._id);
            if (user) {
                return res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || "",
                    bio: user.bio || "",
                    isSuperhost: user.isSuperhost || false,
                    wishlist: user.wishlist || [],
                });
            }
        }
        return res.json(req.user);
    }
    res.json(null);
}));

// POST /api/users/signup
router.post(
    "/signup",
    wrapAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (mongoose.connection.readyState === 1) {
                const newUser = new User({ email, username });
                const registeredUser = await User.register(newUser, password);
                req.login(registeredUser, (err) => {
                    if (err) return next(err);
                    res.status(201).json({
                        _id: registeredUser._id,
                        username: registeredUser.username,
                        email: registeredUser.email,
                        avatar: registeredUser.avatar,
                        wishlist: registeredUser.wishlist || [],
                    });
                });
                return;
            }

            const newUser = inMemoryStore.registerUser({ username, email, password });
            req.login(newUser, (err) => {
                if (err) return next(err);
                res.status(201).json(newUser);
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    })
);

// POST /api/users/login
router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if (mongoose.connection.readyState === 1) {
        passport.authenticate("local", (err, user, info) => {
            if (err) return res.status(500).json({ error: "Authentication error" });
            if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials" });
            req.login(user, (err) => {
                if (err) return res.status(500).json({ error: "Login failed" });
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || "",
                    bio: user.bio || "",
                    isSuperhost: user.isSuperhost || false,
                    wishlist: user.wishlist || [],
                });
            });
        })(req, res, next);
        return;
    }

    const user = inMemoryStore.authenticateUser(username, password);
    if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
    }
    req.login(user, (err) => {
        if (err) return res.status(500).json({ error: "Login failed" });
        res.json(user);
    });
});

// POST /api/users/demo-login
router.post(
    "/demo-login",
    wrapAsync(async (req, res, next) => {
        const { role = "guest" } = req.body;
        const targetUsername = role === "host" ? "wander_host" : "alex_traveler";

        if (mongoose.connection.readyState === 1) {
            let user = await User.findOne({ username: targetUsername });
            if (!user) {
                user = new User({
                    username: targetUsername,
                    email: `${targetUsername}@farebnb.com`,
                    isSuperhost: role === "host",
                    bio: role === "host" ? "Superhost with luxury properties." : "World explorer.",
                    avatar: role === "host"
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                });
                await User.register(user, "demo1234");
            }
            req.login(user, (err) => {
                if (err) return next(err);
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || "",
                    bio: user.bio || "",
                    isSuperhost: user.isSuperhost || false,
                    wishlist: user.wishlist || [],
                });
            });
            return;
        }

        const user = inMemoryStore.findUserByUsername(targetUsername);
        if (!user) return res.status(404).json({ error: "Demo user not found" });
        req.login(user, (err) => {
            if (err) return next(err);
            res.json(user);
        });
    })
);

// POST /api/users/logout
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;

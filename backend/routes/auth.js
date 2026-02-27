const express = require("express");
const router = express.Router();

const admin = require("../init/firebaseAdmin");   // Firebase Admin
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ===============================
// Google Authentication Route
// ===============================

router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // 1️⃣ Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, picture, uid } = decoded;

    if (!email) {
      return res.status(400).json({ error: "Email not available from Google" });
    }

    // 2️⃣ Check if user exists in DB
    let user = await User.findOne({ email });

    // 3️⃣ Create user if not exists
    if (!user) {
      user = new User({
        email,
        username: name
          ? name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000)
          : "googleuser" + Math.floor(Math.random() * 1000),
        googleId: uid,
        avatar: picture,
      });

      await user.save();
    }

    // 4️⃣ Generate YOUR JWT token
    const myToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send token + user to frontend
    res.status(200).json({
      token: myToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user.js");
const inMemoryStore = require("../../models/inMemoryStore.js");
const wrapAsync = require("../../utils/wrapAsync.js");

const isLoggedInApi = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

// GET /api/wishlist
router.get(
    "/",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.user._id).populate({
                path: "wishlist",
                populate: { path: "owner", select: "username avatar" }
            });
            return res.json(user?.wishlist || []);
        }

        const wishlist = inMemoryStore.getUserWishlist(req.user._id);
        res.json(wishlist);
    })
);

// POST /api/wishlist/:id
router.post(
    "/:id",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ error: "User not found" });

            const idx = user.wishlist.findIndex((item) => item.toString() === id.toString());
            let isSaved = false;
            if (idx > -1) {
                user.wishlist.splice(idx, 1);
                isSaved = false;
            } else {
                user.wishlist.push(id);
                isSaved = true;
            }
            await user.save();
            return res.json({ isSaved, wishlist: user.wishlist });
        }

        const result = inMemoryStore.toggleWishlist(req.user._id, id);
        res.json(result);
    })
);

module.exports = router;

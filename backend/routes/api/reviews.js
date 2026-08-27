const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const wrapAsync = require("../../utils/wrapAsync.js");
const Listing = require("../../models/listing.js");
const Review = require("../../models/review.js");
const inMemoryStore = require("../../models/inMemoryStore.js");

const isLoggedInApi = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

// POST /api/listings/:id/reviews
router.post(
    "/",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const { review } = req.body;

        if (mongoose.connection.readyState === 1) {
            const listing = await Listing.findById(id);
            if (!listing) return res.status(404).json({ error: "Listing not found" });

            const newReview = new Review(review);
            newReview.author = req.user._id;
            listing.reviews.push(newReview);

            await newReview.save();
            await listing.save();
            await newReview.populate("author");

            return res.status(201).json(newReview);
        }

        const newReview = inMemoryStore.addReview(id, review, req.user);
        res.status(201).json(newReview);
    })
);

// DELETE /api/listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;

        if (mongoose.connection.readyState === 1) {
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            return res.json({ message: "Review deleted successfully" });
        }

        inMemoryStore.deleteReview(id, reviewId);
        res.json({ message: "Review deleted successfully" });
    })
);

module.exports = router;

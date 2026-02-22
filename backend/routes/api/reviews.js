const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../../utils/wrapAsync.js");
const Listing = require("../../models/listing.js");
const Review = require("../../models/review.js");
const { reviewSchema } = require("../../schema.js");

// Middleware: check if logged in (API version)
const isLoggedInApi = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

// Middleware: check if review author (API version)
const isReviewAuthorApi = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: "Review not found" });
    }
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not the author of this review" });
    }
    next();
};

// Validate review body
const validateReviewApi = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return res.status(400).json({ error: errMsg });
    }
    next();
};

// POST /api/listings/:id/reviews - Create a review
router.post(
    "/",
    isLoggedInApi,
    validateReviewApi,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        // Populate author for response
        await newReview.populate("author");

        res.status(201).json(newReview);
    })
);

// DELETE /api/listings/:id/reviews/:reviewId - Delete a review
router.delete(
    "/:reviewId",
    isLoggedInApi,
    isReviewAuthorApi,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.json({ message: "Review deleted successfully" });
    })
);

module.exports = router;

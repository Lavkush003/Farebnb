
// const express =require("express");
// const router =express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");

// const Review = require("../models/review.js");
// const { validateReview } =require("../middleware.js");

// //Post Review Route

// router.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review Created!");

//     res.redirect(`/listings/${listing._id}`);

// }));

// //Delete Review Route

// router.delete(
//     "/listings/:id/reviews/:reviewId",
//     wrapAsync(async (req, res)=>{
//         let {id, reviewId} = req.params;

//         await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//         await Review.findByIdAndDelete(reviewId);
//         req.flash("success", "Review Deleted!");

//         res.redirect(`/listings/${id}`);
//     })

// );

// module.exports = router;



const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");   // ✅ ADD THIS
const Review = require("../models/review.js");
const { validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// ======================
// Post Review Route
// ======================

router.post(
    "/",
    isLoggedIn,
     validateReview, 
    wrapAsync(reviewController.createReview)
);


// ======================
// Delete Review Route
// ======================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     wrapAsync(reviewController.destroyReview)
    );


module.exports = router;

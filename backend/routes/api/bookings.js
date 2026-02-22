const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const Booking = require("../../models/booking.js");
const Listing = require("../../models/listing.js");
const ExpressError = require("../../utils/ExpressError.js");

// Middleware: check if logged in (API version)
const isLoggedInApi = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

// POST /api/bookings/:listingId - Create a new booking
router.post(
    "/:listingId",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { listingId } = req.params;
        const { startDate, endDate, totalPrice } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // Prevent booking own listing
        if (listing.owner.equals(req.user._id)) {
            return res.status(400).json({ error: "You cannot book your own listing" });
        }

        const newBooking = new Booking({
            listing: listingId,
            user: req.user._id,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    })
);

// GET /api/bookings/user - Get bookings for the currently logged in user
router.get(
    "/user",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });
        res.json(bookings);
    })
);

module.exports = router;

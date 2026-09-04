const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../../utils/wrapAsync.js");
const Booking = require("../../models/booking.js");
const inMemoryStore = require("../../models/inMemoryStore.js");

const isLoggedInApi = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

// POST /api/bookings/:listingId
router.post(
    "/:listingId",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { listingId } = req.params;
        const { startDate, endDate, totalPrice, guests = 1, paymentMethod } = req.body;
        const validPaymentMethods = ["cash", "card", "online"];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ error: "Please select a valid payment method" });
        }

        if (mongoose.connection.readyState === 1) {
            const newBooking = new Booking({
                listing: listingId,
                user: req.user._id,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guests: Number(guests) || 1,
                totalPrice: Number(totalPrice),
                paymentMethod,
                paymentStatus: "pending",
                status: "confirmed",
            });
            const saved = await newBooking.save();
            await saved.populate("listing");
            return res.status(201).json(saved);
        }

        const saved = inMemoryStore.createBooking({
            listingId,
            userId: req.user._id,
            startDate,
            endDate,
            guests,
            totalPrice,
            paymentMethod,
        });
        res.status(201).json(saved);
    })
);

// GET /api/bookings/:listingId/dates
router.get(
    "/:listingId/dates",
    wrapAsync(async (req, res) => {
        const { listingId } = req.params;

        if (mongoose.connection.readyState === 1) {
            const bookings = await Booking.find({
                listing: listingId,
                status: "confirmed"
            }).select("startDate endDate");
            return res.json(bookings);
        }

        const bookings = inMemoryStore.getListingBookedDates(listingId);
        res.json(bookings);
    })
);

// GET /api/bookings/user
router.get(
    "/user",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        if (mongoose.connection.readyState === 1) {
            const bookings = await Booking.find({ user: req.user._id })
                .populate({
                    path: "listing",
                    populate: { path: "owner", select: "username email avatar" }
                })
                .sort({ createdAt: -1 });
            return res.json(bookings);
        }

        const bookings = inMemoryStore.getUserBookings(req.user._id);
        res.json(bookings);
    })
);

// GET /api/bookings/host
router.get(
    "/host",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        if (mongoose.connection.readyState === 1) {
            const Listing = require("../../models/listing.js");
            const hostListings = await Listing.find({ owner: req.user._id }).select("_id");
            const listingIds = hostListings.map(l => l._id);

            const bookings = await Booking.find({ listing: { $in: listingIds } })
                .populate("listing")
                .populate("user", "username email avatar")
                .sort({ createdAt: -1 });

            return res.json(bookings);
        }

        const bookings = inMemoryStore.getHostBookings(req.user._id);
        res.json(bookings);
    })
);

// DELETE /api/bookings/:id - Cancel a booking
router.delete(
    "/:id",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        if (mongoose.connection.readyState === 1) {
            const booking = await Booking.findById(id);
            if (!booking) return res.status(404).json({ error: "Booking not found" });
            booking.status = "cancelled";
            await booking.save();
            return res.json({ message: "Booking cancelled", booking });
        }

        const cancelled = inMemoryStore.cancelBooking(id, req.user._id);
        res.json({ message: "Booking cancelled", booking: cancelled });
    })
);

module.exports = router;

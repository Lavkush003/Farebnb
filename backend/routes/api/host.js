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

// GET /api/host/dashboard
router.get(
    "/dashboard",
    isLoggedInApi,
    wrapAsync(async (req, res) => {
        let hostBookings = [];

        if (mongoose.connection.readyState === 1) {
            const Listing = require("../../models/listing.js");
            const hostListings = await Listing.find({ owner: req.user._id }).select("_id");
            const listingIds = hostListings.map(l => l._id);

            hostBookings = await Booking.find({ listing: { $in: listingIds } })
                .populate("listing")
                .populate("user", "username email avatar")
                .sort({ createdAt: -1 });
        } else {
            hostBookings = inMemoryStore.getHostBookings(req.user._id);
        }

        // Aggregate analytics
        const stats = {
            totalRevenue: 0,
            totalBookings: hostBookings.length,
            upcomingGuests: 0,
        };

        const now = new Date();
        const upcomingBookings = [];

        hostBookings.forEach((b) => {
            if (b.status === "confirmed") {
                stats.totalRevenue += (b.totalPrice || 0);
            }
            
            const startDate = new Date(b.startDate);
            if (startDate >= now && b.status === "confirmed") {
                stats.upcomingGuests += (b.guests || 1);
                upcomingBookings.push(b);
            }
        });

        res.json({
            stats,
            recentBookings: hostBookings.slice(0, 10), // Limit to 10 for dashboard
            upcomingBookings
        });
    })
);

module.exports = router;

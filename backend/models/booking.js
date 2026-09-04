const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        default: 1,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "online"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed"],
        default: "confirmed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBookings } from "../api";
import { format } from "date-fns";
import "./MyBookings.css";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserBookings()
            .then(res => setBookings(res.data))
            .catch(err => console.error("Failed to fetch bookings:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading your trips...</p>
            </div>
        );
    }

    return (
        <div className="wh-bookings-page">
            <h2>My Trips</h2>

            {bookings.length === 0 ? (
                <div className="wh-empty-state">
                    <h3>No trips booked yet!</h3>
                    <p>Time to dust off your bags and start planning your next adventure.</p>
                    <br />
                    <Link to="/" className="wh-btn wh-btn-outline">Start Searching</Link>
                </div>
            ) : (
                <div className="wh-bookings-grid">
                    {bookings.map(booking => {
                        const listing = booking.listing;
                        if (!listing) return null;

                        return (
                            <Link
                                to={`/listings/${listing._id}`}
                                key={booking._id}
                                className="wh-booking-card"
                            >
                                <div className="wh-booking-img">
                                    <img
                                        src={listing.image?.url || "https://via.placeholder.com/400"}
                                        alt={listing.title}
                                    />
                                </div>
                                <div className="wh-booking-details">
                                    <h3>{listing.title}</h3>
                                    <p className="wh-booking-loc">{listing.location}, {listing.country}</p>
                                    <div className="wh-booking-dates">
                                        <p>{format(new Date(booking.startDate), "MMM d, yyyy")} - {format(new Date(booking.endDate), "MMM d, yyyy")}</p>
                                    </div>
                                    <p className="wh-booking-price">
                                        Total paid: <strong>₹{booking.totalPrice.toLocaleString("en-IN")}</strong>
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

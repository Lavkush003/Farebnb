import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../api";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaSuitcase, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import "./MyBookings.css";

export default function MyBookingsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const res = await getUserBookings();
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
        setCancellingId(bookingId);
        try {
            await cancelBooking(bookingId);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to cancel reservation");
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading your trips...</p>
            </div>
        );
    }

    return (
        <div className="wh-bookings-page-container">
            <div className="wh-bookings-header">
                <h1>Trips & Reservations</h1>
                <p>Manage all your upcoming and past vacation stays</p>
            </div>

            {bookings.length === 0 ? (
                <div className="wh-bookings-empty-state">
                    <div className="wh-empty-luggage-icon"><FaSuitcase /></div>
                    <h3>No trips booked... yet!</h3>
                    <p>
                        Time to dust off your bags and start planning your next great adventure.
                    </p>
                    <Link to="/" className="wh-btn wh-btn-primary">
                        Explore Destinations
                    </Link>
                </div>
            ) : (
                <div className="wh-trips-cards-grid">
                    {bookings.map((booking) => {
                        const listing = booking.listing;
                        if (!listing) return null;
                        const isCancelled = booking.status === "cancelled";

                        return (
                            <div key={booking._id} className="wh-trip-card">
                                <div className="wh-trip-img-box">
                                    <img
                                        src={
                                            listing.image?.url ||
                                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                                        }
                                        alt={listing.title}
                                        className="wh-trip-img"
                                    />
                                    <span
                                        className={`wh-trip-status-tag ${
                                            isCancelled ? "cancelled" : "confirmed"
                                        }`}
                                    >
                                        {isCancelled ? (
                                            <>
                                                <FaTimesCircle /> Cancelled
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle /> Confirmed
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="wh-trip-details-box">
                                    <div className="wh-trip-top-info">
                                        <span className="wh-trip-loc">
                                            <FaMapMarkerAlt /> {listing.location}, {listing.country}
                                        </span>
                                        <h3 className="wh-trip-listing-title">
                                            <Link to={`/listings/${listing._id}`}>
                                                {listing.title}
                                            </Link>
                                        </h3>
                                    </div>

                                    <div className="wh-trip-meta-grid">
                                        <div className="wh-trip-meta-item">
                                            <FaCalendarAlt className="wh-meta-icon" />
                                            <div>
                                                <label>Dates</label>
                                                <span>
                                                    {format(new Date(booking.startDate), "MMM d, yyyy")} –{" "}
                                                    {format(new Date(booking.endDate), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="wh-trip-meta-item">
                                            {booking.paymentMethod === "cash" ? <FaMoneyBillWave className="wh-meta-icon" /> : booking.paymentMethod === "online" ? <FaMobileAlt className="wh-meta-icon" /> : <FaCreditCard className="wh-meta-icon" />}
                                            <div>
                                                <label>Payment</label>
                                                <span>{booking.paymentMethod === "card" ? "Debit / Credit Card" : booking.paymentMethod === "online" ? "Online Payment" : "Cash"}</span>
                                            </div>
                                        </div>

                                        <div className="wh-trip-meta-item">
                                            <FaUsers className="wh-meta-icon" />
                                            <div>
                                                <label>Guests</label>
                                                <span>{booking.guests || 1} guest{(booking.guests || 1) > 1 ? "s" : ""}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="wh-trip-footer-row">
                                        <div className="wh-trip-price">
                                            <label>Total Paid</label>
                                            <strong>₹{booking.totalPrice?.toLocaleString("en-IN")}</strong>
                                        </div>

                                        <div className="wh-trip-actions">
                                            <Link
                                                to={`/listings/${listing._id}`}
                                                className="wh-btn wh-btn-outline"
                                            >
                                                View Stay
                                            </Link>
                                            {!isCancelled && (
                                                <button
                                                    type="button"
                                                    className="wh-btn-cancel-trip"
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    disabled={cancellingId === booking._id}
                                                >
                                                    {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getHostListings, getHostDashboard, deleteListing } from "../api";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import {
    FaHome,
    FaMoneyBillWave,
    FaCalendarCheck,
    FaPlus,
    FaEdit,
    FaTrash,
    FaExternalLinkAlt,
    FaStar,
    FaAward,
    FaUsers
} from "react-icons/fa";
import "./HostDashboard.css";

export default function HostDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, upcomingGuests: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("properties"); // "properties" | "reservations"

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchHostData();
    }, [user, navigate]);

    const fetchHostData = async () => {
        try {
            const [listingsRes, dashboardRes] = await Promise.all([
                getHostListings(),
                getHostDashboard(),
            ]);
            setListings(Array.isArray(listingsRes.data) ? listingsRes.data : []);
            setBookings(Array.isArray(dashboardRes.data.recentBookings) ? dashboardRes.data.recentBookings : []);
            if (dashboardRes.data.stats) {
                setStats(dashboardRes.data.stats);
            }
        } catch (err) {
            console.error("Failed to load host dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (listingId) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await deleteListing(listingId);
            setListings(prev => prev.filter(l => l._id !== listingId));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete listing");
        }
    };

    const totalRevenue = stats.totalRevenue || 0;
    const activeReservations = stats.upcomingGuests || 0;

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading host control hub...</p>
            </div>
        );
    }

    return (
        <div className="wh-host-dashboard">
            {/* Header */}
            <div className="wh-host-header">
                <div className="wh-host-header-text">
                    <h1>Host Dashboard</h1>
                    <p>Welcome back, <strong>{user?.username}</strong>! Manage your properties and reservations.</p>
                </div>
                <Link to="/listings/new" className="wh-btn wh-btn-primary">
                    <FaPlus /> Create New Listing
                </Link>
            </div>

            {/* Metrics Overview Cards */}
            <div className="wh-host-metrics-grid">
                <div className="wh-metric-card">
                    <div className="wh-metric-icon icon-home"><FaHome /></div>
                    <div className="wh-metric-info">
                        <span className="wh-metric-label">Listed Properties</span>
                        <strong className="wh-metric-value">{listings.length}</strong>
                    </div>
                </div>

                <div className="wh-metric-card">
                    <div className="wh-metric-icon icon-rev"><FaMoneyBillWave /></div>
                    <div className="wh-metric-info">
                        <span className="wh-metric-label">Total Earnings</span>
                        <strong className="wh-metric-value">₹{totalRevenue.toLocaleString("en-IN")}</strong>
                    </div>
                </div>

                <div className="wh-metric-card">
                    <div className="wh-metric-icon icon-booking"><FaCalendarCheck /></div>
                    <div className="wh-metric-info">
                        <span className="wh-metric-label">Active Bookings</span>
                        <strong className="wh-metric-value">{activeReservations}</strong>
                    </div>
                </div>

                <div className="wh-metric-card">
                    <div className="wh-metric-icon icon-superhost"><FaAward /></div>
                    <div className="wh-metric-info">
                        <span className="wh-metric-label">Host Status</span>
                        <strong className="wh-metric-value">
                            {user?.isSuperhost ? "Superhost ★" : "Verified Host"}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="wh-host-tabs">
                <button
                    className={`wh-host-tab-btn ${activeTab === "properties" ? "active" : ""}`}
                    onClick={() => setActiveTab("properties")}
                >
                    <FaHome /> My Listings ({listings.length})
                </button>
                <button
                    className={`wh-host-tab-btn ${activeTab === "reservations" ? "active" : ""}`}
                    onClick={() => setActiveTab("reservations")}
                >
                    <FaUsers /> Guest Reservations ({bookings.length})
                </button>
            </div>

            {/* Tab 1: My Listings */}
            {activeTab === "properties" && (
                <div className="wh-host-tab-content">
                    {listings.length === 0 ? (
                        <div className="wh-host-empty">
                            <FaHome className="wh-empty-icon" />
                            <h3>No properties listed yet</h3>
                            <p>Turn your extra space into extra income by becoming an Airbnb host.</p>
                            <Link to="/listings/new" className="wh-btn wh-btn-primary">
                                Create your first listing
                            </Link>
                        </div>
                    ) : (
                        <div className="wh-host-listings-grid">
                            {listings.map((item) => (
                                <div key={item._id} className="wh-host-property-card">
                                    <img
                                        src={
                                            item.image?.url ||
                                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                                        }
                                        alt={item.title}
                                        className="wh-host-prop-img"
                                    />
                                    <div className="wh-host-prop-body">
                                        <div className="wh-host-prop-header">
                                            <span className="wh-prop-loc">{item.location}, {item.country}</span>
                                            <span className="wh-prop-cat">{item.category || "Trending"}</span>
                                        </div>
                                        <h3 className="wh-host-prop-title">{item.title}</h3>
                                        <p className="wh-host-prop-price">
                                            <strong>₹{item.price?.toLocaleString("en-IN")}</strong> / night
                                        </p>
                                        <p className="wh-host-prop-specs">
                                            {item.maxGuests || 2} guests · {item.bedrooms || 1} bed · {item.bathrooms || 1} bath
                                        </p>

                                        <div className="wh-host-prop-actions">
                                            <Link
                                                to={`/listings/${item._id}`}
                                                className="wh-btn wh-btn-outline wh-btn-sm"
                                            >
                                                <FaExternalLinkAlt /> View
                                            </Link>
                                            <Link
                                                to={`/listings/${item._id}/edit`}
                                                className="wh-btn wh-btn-outline wh-btn-sm"
                                            >
                                                <FaEdit /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="wh-btn-delete-sm"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Guest Reservations */}
            {activeTab === "reservations" && (
                <div className="wh-host-tab-content">
                    {bookings.length === 0 ? (
                        <div className="wh-host-empty">
                            <FaCalendarCheck className="wh-empty-icon" />
                            <h3>No guest reservations yet</h3>
                            <p>When travelers book your stays, their booking information will show up here.</p>
                        </div>
                    ) : (
                        <div className="wh-reservations-table-wrapper">
                            <table className="wh-reservations-table">
                                <thead>
                                    <tr>
                                        <th>Guest</th>
                                        <th>Property</th>
                                        <th>Check-in & Checkout</th>
                                        <th>Guests</th>
                                        <th>Payout</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td>
                                                <div className="wh-guest-cell">
                                                    <img
                                                        src={
                                                            booking.user?.avatar ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.username || 'Guest')}&background=ff385c&color=fff&size=100`
                                                        }
                                                        alt="Guest avatar"
                                                        className="wh-guest-table-avatar"
                                                    />
                                                    <div>
                                                        <strong>{booking.user?.username || "Guest"}</strong>
                                                        <span>{booking.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{booking.listing?.title || "Property"}</strong>
                                            </td>
                                            <td>
                                                {format(new Date(booking.startDate), "MMM d, yyyy")} –{" "}
                                                {format(new Date(booking.endDate), "MMM d, yyyy")}
                                            </td>
                                            <td>{booking.guests || 1} guest{(booking.guests || 1) > 1 ? "s" : ""}</td>
                                            <td>
                                                <strong>₹{booking.totalPrice?.toLocaleString("en-IN")}</strong>
                                            </td>
                                            <td>
                                                <span
                                                    className={`wh-badge ${
                                                        booking.status === "confirmed"
                                                            ? "wh-badge-status-confirmed"
                                                            : "wh-badge-status-cancelled"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

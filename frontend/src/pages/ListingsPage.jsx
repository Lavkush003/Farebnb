import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllListings } from "../api";
import {
    FaFire, FaBed, FaMountain, FaSwimmingPool,
    FaCampground, FaSnowflake, FaShip, FaIgloo
} from "react-icons/fa";
import { FaCow, FaFortAwesome, FaMountainCity } from "react-icons/fa6";
import "./Listings.css";

const FILTERS = [
    { label: "Trending", icon: <FaFire /> },
    { label: "Rooms", icon: <FaBed /> },
    { label: "Iconic Cities", icon: <FaMountainCity /> },
    { label: "Mountains", icon: <FaMountain /> },
    { label: "Castles", icon: <FaFortAwesome /> },
    { label: "Amazing Pools", icon: <FaSwimmingPool /> },
    { label: "Camping", icon: <FaCampground /> },
    { label: "Arctic", icon: <FaSnowflake /> },
    { label: "Farms", icon: <FaCow /> },
    { label: "Domes", icon: <FaIgloo /> },
    { label: "Boats", icon: <FaShip /> },
];

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTax, setShowTax] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    useEffect(() => {
        getAllListings()
            .then((res) => setListings(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading amazing stays...</p>
            </div>
        );
    }

    let displayedListings = listings;

    if (searchQuery) {
        displayedListings = displayedListings.filter(l =>
            (l.title && l.title.toLowerCase().includes(searchQuery)) ||
            (l.location && l.location.toLowerCase().includes(searchQuery)) ||
            (l.country && l.country.toLowerCase().includes(searchQuery))
        );
    } else if (activeFilter !== null) {
        displayedListings = displayedListings.filter((_, i) => i % FILTERS.length === activeFilter);
    }

    return (
        <div className="wh-listings-page">
            {/* Category Filters */}
            <div className="wh-filters-bar">
                <div className="wh-filters-scroll">
                    {FILTERS.map((f, i) => (
                        <button
                            key={i}
                            className={`wh-filter-chip ${activeFilter === i ? "active" : ""}`}
                            onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                        >
                            <span className="wh-filter-icon">{f.icon}</span>
                            <span className="wh-filter-label">{f.label}</span>
                        </button>
                    ))}
                </div>

                <div className="wh-tax-toggle">
                    <label className="wh-switch">
                        <input
                            type="checkbox"
                            checked={showTax}
                            onChange={() => setShowTax(!showTax)}
                        />
                        <span className="wh-switch-slider"></span>
                    </label>
                    <span className="wh-tax-label">Show total after taxes</span>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="wh-listings-grid">
                {displayedListings.map((listing) => (
                    <Link
                        to={`/listings/${listing._id}`}
                        key={listing._id}
                        className="wh-listing-card"
                    >
                        <div className="wh-card-img-wrapper">
                            <img
                                src={listing.image?.url || "https://via.placeholder.com/400x300"}
                                alt={listing.title}
                                className="wh-card-img"
                            />
                            <div className="wh-card-overlay" />
                        </div>
                        <div className="wh-card-body">
                            <h3 className="wh-card-title">{listing.title}</h3>
                            <p className="wh-card-price">
                                ₹{listing.price?.toLocaleString("en-IN")} / night
                                {showTax && (
                                    <span className="wh-tax-info"> + 18% GST</span>
                                )}
                            </p>
                            <p className="wh-card-location">
                                {listing.location}, {listing.country}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {displayedListings.length === 0 && (
                <div className="wh-empty-state">
                    <h3>No listings found</h3>
                    <p>Be the first to list your property!</p>
                </div>
            )}
        </div>
    );
}

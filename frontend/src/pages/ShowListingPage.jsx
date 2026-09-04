import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getListing, deleteListing, createReview, deleteReview } from "../api";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import BookingWidget from "../components/BookingWidget";
import {
    FaStar,
    FaMapMarkerAlt,
    FaTrash,
    FaEdit,
    FaHeart,
    FaRegHeart,
    FaShareAlt,
    FaWifi,
    FaSwimmingPool,
    FaSnowflake,
    FaCar,
    FaTv,
    FaCoffee,
    FaHotTub,
    FaFire,
    FaKey,
    FaLaptop,
    FaCalendarCheck,
    FaShieldAlt,
    FaUtensils,
    FaCheck,
    FaCommentDots
} from "react-icons/fa";
import { MdOutlineBed, MdOutlineBathtub } from "react-icons/md";
import "./ShowListing.css";

// Helper map for amenity icons
const AMENITY_ICONS = {
    Wifi: <FaWifi />,
    Kitchen: <FaUtensils />,
    "Air conditioning": <FaSnowflake />,
    "Free parking": <FaCar />,
    Pool: <FaSwimmingPool />,
    "Hot tub": <FaHotTub />,
    "Dedicated workspace": <FaLaptop />,
    TV: <FaTv />,
    "Coffee maker": <FaCoffee />,
    "Indoor fireplace": <FaFire />,
    "Breakfast included": <FaCoffee />,
    "Pet friendly": <FaHeart />,
};

const AMENITY_DESCRIPTIONS = {
    Wifi: "Stay connected with reliable high-speed internet.",
    Kitchen: "Prepare meals in the well-equipped kitchen.",
    "Air conditioning": "Keep comfortable with climate control.",
    "Free parking": "Park easily with complimentary on-site parking.",
    Pool: "Enjoy a refreshing swim without leaving the property.",
    "Hot tub": "Unwind in the private hot tub after a day out.",
    "Dedicated workspace": "Settle into a quiet space for focused work.",
    TV: "Relax with entertainment in the living space.",
    "Coffee maker": "Start the morning with fresh coffee at home.",
    "Indoor fireplace": "Gather around the warm indoor fireplace.",
    "Breakfast included": "Begin the day with breakfast provided by your host.",
    "Pet friendly": "Bring your companion along for the stay.",
};

export default function ShowListingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isWishlisted, toggleWishlist } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flash, setFlash] = useState(null);

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        fetchListingData();
    }, [id]);

    const fetchListingData = async () => {
        try {
            const res = await getListing(id);
            setListing(res.data);
        } catch {
            setFlash({ message: "Listing not found", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Initialize Mapbox map
    useEffect(() => {
        if (
            !listing ||
            !listing.geometry ||
            !listing.geometry.coordinates ||
            !mapContainer.current
        )
            return;
        if (map.current) return;

        const [lng, lat] = listing.geometry.coordinates;
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

        map.current = L.map(mapContainer.current).setView([lat, lng], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map.current);
        L.marker([lat, lng], {
            icon: L.divIcon({ className: "wh-leaflet-detail-marker", html: "<span></span>", iconAnchor: [12, 24] }),
        }).addTo(map.current).bindPopup(`<strong>${listing.title}</strong><br>${listing.location}, ${listing.country}`).openPopup();
    }, [listing]);

    const handleDeleteListing = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
        try {
            await deleteListing(id);
            navigate("/");
        } catch {
            setFlash({ message: "Failed to delete listing", type: "error" });
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmittingReview(true);
        try {
            await createReview(id, { review: { rating, comment } });
            setComment("");
            setRating(5);
            setFlash({ message: "Review posted successfully!", type: "success" });
            fetchListingData();
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Failed to post review",
                type: "error",
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(id, reviewId);
            setFlash({ message: "Review deleted", type: "success" });
            fetchListingData();
        } catch {
            setFlash({ message: "Failed to delete review", type: "error" });
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            alert("Please log in to save this stay to your wishlist!");
            return;
        }
        try {
            await toggleWishlist(listing._id);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading luxury stay...</p>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="wh-show-page-wrapper">
                <FlashMessage message="Listing not found" type="error" />
                <Link to="/" className="wh-back-link">
                    ← Back to all stays
                </Link>
            </div>
        );
    }

    const isOwner = user && listing.owner && user._id === listing.owner._id;
    const isSaved = isWishlisted(listing._id);
    const avgRating =
        listing.reviews?.length > 0
            ? (
                  listing.reviews.reduce((a, b) => a + (b.rating || 5), 0) /
                  listing.reviews.length
              ).toFixed(2)
            : "5.0";

    const photos = [
        listing.image?.url ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    ];
    const amenities = listing.amenities?.length ? listing.amenities : ["Wifi"];
    const highlights = amenities.slice(0, 3);

    return (
        <div className="wh-show-page-container">
            {flash && (
                <FlashMessage
                    message={flash.message}
                    type={flash.type}
                    onClose={() => setFlash(null)}
                />
            )}

            {/* Top Title & Header Actions */}
            <div className="wh-show-header-area">
                <h1 className="wh-show-main-title">{listing.title}</h1>

                <div className="wh-show-sub-header">
                    <div className="wh-show-meta-left">
                        <span className="wh-meta-rating">
                            <FaStar className="wh-star-icon" /> {avgRating}
                        </span>
                        <span className="wh-meta-reviews">
                            · <u>{listing.reviews?.length || 1} reviews</u>
                        </span>
                        {listing.owner?.isSuperhost && (
                            <span className="wh-meta-badge">· ★ Superhost</span>
                        )}
                        <span className="wh-meta-loc">
                            · <u>{listing.location}, {listing.country}</u>
                        </span>
                    </div>

                    <div className="wh-show-meta-right">
                        <button className="wh-meta-action-btn" onClick={handleShare}>
                            <FaShareAlt /> {copiedShare ? "Link copied!" : "Share"}
                        </button>
                        <button
                            className={`wh-meta-action-btn ${isSaved ? "saved" : ""}`}
                            onClick={handleWishlistToggle}
                        >
                            {isSaved ? (
                                <FaHeart className="wh-heart-saved" />
                            ) : (
                                <FaRegHeart />
                            )}{" "}
                            {isSaved ? "Saved" : "Save"}
                        </button>

                        {isOwner && (
                            <div className="wh-owner-controls">
                                <Link
                                    to={`/listings/${id}/edit`}
                                    className="wh-btn-owner wh-btn-owner-edit"
                                >
                                    <FaEdit /> Edit
                                </Link>
                                <button
                                    onClick={handleDeleteListing}
                                    className="wh-btn-owner wh-btn-owner-delete"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Airbnb 5-Photo Mosaic Grid */}
            <div className="wh-photo-mosaic-grid">
                <div className="wh-mosaic-main">
                    <img src={photos[0]} alt={listing.title} className="wh-mosaic-img"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"; }}
                    />
                </div>
                <div className="wh-mosaic-col">
                    <img src={photos[1]} alt="Interior view" className="wh-mosaic-img"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"; }}
                    />
                    <img src={photos[2]} alt="Bedroom space" className="wh-mosaic-img"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"; }}
                    />
                </div>
                <div className="wh-mosaic-col wh-mosaic-col-right">
                    <img src={photos[3]} alt="Bathroom" className="wh-mosaic-img"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"; }}
                    />
                    <img src={photos[4]} alt="Amenities" className="wh-mosaic-img"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"; }}
                    />
                </div>
            </div>

            {/* Content Layout: Details (Left) + Booking Widget (Right) */}
            <div className="wh-show-body-grid">
                <div className="wh-show-details-left">
                    {/* Hosted by info */}
                    <div className="wh-host-summary-row">
                        <div className="wh-host-text">
                            <h2>
                                Entire home hosted by {listing.owner?.username || "Superhost"}
                            </h2>
                            <p className="wh-specs-summary">
                                {listing.maxGuests || 4} guests · {listing.bedrooms || 2}{" "}
                                bedrooms · {listing.beds || 3} beds · {listing.bathrooms || 2}{" "}
                                bathrooms
                            </p>
                        </div>
                        <img
                            src={
                                listing.owner?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.owner?.username || 'Host')}&background=222&color=fff&size=150`
                            }
                            alt={listing.owner?.username || "Host"}
                            className="wh-host-avatar-lg"
                        />
                    </div>
                    
                    {!isOwner && (
                        <div style={{ marginTop: "16px" }}>
                            <button
                                className="wh-btn wh-btn-outline"
                                onClick={() => navigate("/messages", { state: { hostId: listing.owner?._id, hostName: listing.owner?.username } })}
                            >
                                <FaCommentDots /> Contact Host
                            </button>
                        </div>
                    )}

                    <hr className="wh-section-divider" />

                    <div className="wh-highlights-container">
                        {highlights.map((amenity) => (
                            <div className="wh-highlight-item" key={amenity}>
                                <div className="wh-hl-icon">{AMENITY_ICONS[amenity] || <FaCheck />}</div>
                                <div>
                                    <h4>{amenity}</h4>
                                    <p>{AMENITY_DESCRIPTIONS[amenity] || "A convenient feature included with this stay."}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="wh-section-divider" />

                    {/* Description */}
                    <div className="wh-description-section">
                        <h3>About this space</h3>
                        <p className="wh-description-text">{listing.description}</p>
                    </div>

                    <hr className="wh-section-divider" />

                    {/* Where you'll sleep */}
                    <div className="wh-sleep-section">
                        <h3>Where you'll sleep</h3>
                        <div className="wh-sleep-cards">
                            <div className="wh-sleep-card">
                                <MdOutlineBed className="wh-sleep-icon" />
                                <h4>{listing.bedrooms || 1} bedroom{listing.bedrooms === 1 ? "" : "s"}</h4>
                                <p>{listing.beds || 1} bed{listing.beds === 1 ? "" : "s"} in total</p>
                            </div>
                            <div className="wh-sleep-card">
                                <MdOutlineBathtub className="wh-sleep-icon" />
                                <h4>Bathrooms</h4>
                                <p>{listing.bathrooms || 1} bathroom{listing.bathrooms === 1 ? "" : "s"}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="wh-section-divider" />

                    {/* Amenities Checklist */}
                    <div className="wh-amenities-section">
                        <h3>What this place offers</h3>
                        <div className="wh-amenities-grid">
                            {amenities.map((amenity) => (
                                <div key={amenity} className="wh-amenity-pill">
                                    <span className="wh-amenity-icon">
                                        {AMENITY_ICONS[amenity] || <FaCheck />}
                                    </span>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="wh-section-divider" />

                    {/* Map Area */}
                    <div className="wh-location-section">
                        <h3>Where you'll be</h3>
                        <p className="wh-location-sub">
                            <FaMapMarkerAlt /> {listing.location}, {listing.country}
                        </p>
                        <div
                            ref={mapContainer}
                            className="wh-show-map-frame"
                        />
                    </div>

                    <hr className="wh-section-divider" />

                    {/* Reviews Breakdown & List */}
                    <div className="wh-reviews-container">
                        <div className="wh-reviews-header">
                            <FaStar className="wh-star-icon" />
                            <h2>
                                {avgRating} · {listing.reviews?.length || 1} review
                                {listing.reviews?.length !== 1 ? "s" : ""}
                            </h2>
                        </div>

                        {/* Rating Bars */}
                        <div className="wh-rating-breakdown-grid">
                            <div className="wh-rating-bar-row">
                                <span>Cleanliness</span>
                                <div className="wh-progress-bg">
                                    <div className="wh-progress-fill" style={{ width: "98%" }} />
                                </div>
                                <span>4.9</span>
                            </div>
                            <div className="wh-rating-bar-row">
                                <span>Accuracy</span>
                                <div className="wh-progress-bg">
                                    <div className="wh-progress-fill" style={{ width: "100%" }} />
                                </div>
                                <span>5.0</span>
                            </div>
                            <div className="wh-rating-bar-row">
                                <span>Communication</span>
                                <div className="wh-progress-bg">
                                    <div className="wh-progress-fill" style={{ width: "98%" }} />
                                </div>
                                <span>4.9</span>
                            </div>
                            <div className="wh-rating-bar-row">
                                <span>Location</span>
                                <div className="wh-progress-bg">
                                    <div className="wh-progress-fill" style={{ width: "96%" }} />
                                </div>
                                <span>4.8</span>
                            </div>
                            <div className="wh-rating-bar-row">
                                <span>Value</span>
                                <div className="wh-progress-bg">
                                    <div className="wh-progress-fill" style={{ width: "98%" }} />
                                </div>
                                <span>4.9</span>
                            </div>
                        </div>

                        {/* User Reviews Grid */}
                        <div className="wh-reviews-cards-grid">
                            {listing.reviews && listing.reviews.length > 0 ? (
                                listing.reviews.map((rev) => (
                                    <div key={rev._id} className="wh-rev-card">
                                        <div className="wh-rev-user-row">
                                            <img
                                                src={
                                                    rev.author?.avatar ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author?.username || 'Guest')}&background=ff385c&color=fff&size=100`
                                                }
                                                alt={rev.author?.username || "Guest"}
                                                className="wh-rev-avatar"
                                            />
                                            <div>
                                                <h4>{rev.author?.username || "Verified Traveler"}</h4>
                                                <span>
                                                    {new Date(rev.createdAt || Date.now()).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short", year: "numeric" }
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="wh-rev-stars">
                                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                                <FaStar key={i} className="wh-star-sm" />
                                            ))}
                                        </div>
                                        <p className="wh-rev-comment">{rev.comment}</p>
                                        {user && rev.author && user._id === rev.author._id && (
                                            <button
                                                className="wh-rev-delete-btn"
                                                onClick={() => handleDeleteReview(rev._id)}
                                            >
                                                <FaTrash /> Delete review
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="wh-no-reviews">
                                    No reviews yet. Be the first to leave a review after your stay!
                                </p>
                            )}
                        </div>

                        {/* Add Review Form */}
                        {user ? (
                            <div className="wh-add-review-card">
                                <h3>Leave a review</h3>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="wh-star-picker">
                                        <label>Rating:</label>
                                        <div className="wh-stars-row">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`wh-star-btn ${rating >= star ? "active" : ""}`}
                                                    onClick={() => setRating(star)}
                                                >
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        rows="4"
                                        placeholder="Share details of your own experience at this place..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="wh-btn wh-btn-dark"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? "Submitting..." : "Post Review"}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="wh-login-to-review-box">
                                <p>Log in to leave a review and share your experience.</p>
                                <Link to="/login" className="wh-btn wh-btn-outline">
                                    Log in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Right Side Booking Widget */}
                <div className="wh-show-sidebar-right">
                    <BookingWidget listing={listing} />
                </div>
            </div>
        </div>
    );
}

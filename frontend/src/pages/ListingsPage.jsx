import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllListings } from "../api";
import { useAuth } from "../context/AuthContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    FaFire,
    FaBed,
    FaMountain,
    FaSwimmingPool,
    FaCampground,
    FaSnowflake,
    FaShip,
    FaIgloo,
    FaHeart,
    FaRegHeart,
    FaStar,
    FaMap,
    FaList,
    FaUmbrellaBeach,
    FaSlidersH,
    FaTimes,
    FaArrowRight,
    FaCompass,
    FaCheckCircle,
    FaLeaf,
    FaMoon,
    FaUsers
} from "react-icons/fa";
import { FaCow, FaFortAwesome, FaMountainCity } from "react-icons/fa6";
import "./Listings.css";

const CATEGORIES = [
    { label: "All", icon: <FaFire /> },
    { label: "Trending", icon: <FaFire /> },
    { label: "Beachfront", icon: <FaUmbrellaBeach /> },
    { label: "Mountains", icon: <FaMountain /> },
    { label: "Amazing Pools", icon: <FaSwimmingPool /> },
    { label: "Iconic Cities", icon: <FaMountainCity /> },
    { label: "Castles", icon: <FaFortAwesome /> },
    { label: "Rooms", icon: <FaBed /> },
    { label: "Camping", icon: <FaCampground /> },
    { label: "Arctic", icon: <FaSnowflake /> },
    { label: "Farms", icon: <FaCow /> },
    { label: "Domes", icon: <FaIgloo /> },
    { label: "Boats", icon: <FaShip /> },
];

const STAY_BRIEFS = [
    { label: "A slow weekend", detail: "Quiet rooms and green views", category: "Mountains", icon: <FaLeaf /> },
    { label: "A city reset", detail: "Central stays, easy check-in", category: "Iconic Cities", icon: <FaCompass /> },
    { label: "A night under stars", detail: "Open skies and room to breathe", category: "Camping", icon: <FaMoon /> },
];

export default function ListingsPage() {
    const { user, isWishlisted, toggleWishlist } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [showTax, setShowTax] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "map"
    const [selectedListing, setSelectedListing] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("category") || "All";
    const searchQuery = searchParams.get("search") || "";

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    // Fetch listings whenever search params change
    useEffect(() => {
        const params = {};
        if (activeCategory && activeCategory !== "All") {
            params.category = activeCategory;
        }
        if (searchQuery) {
            params.search = searchQuery;
        }

        setLoading(true);
        getAllListings(params)
            .then((res) => {
                setListings(Array.isArray(res.data) ? res.data : []);
                setLoadError(false);
            })
            .catch((err) => {
                console.error("Failed to fetch listings:", err);
                setLoadError(true);
            })
            .finally(() => setLoading(false));
    }, [activeCategory, searchQuery]);

    // Handle Category change
    const handleCategoryClick = (catLabel) => {
        const newParams = new URLSearchParams(searchParams);
        if (catLabel === "All") {
            newParams.delete("category");
        } else {
            newParams.set("category", catLabel);
        }
        setSearchParams(newParams);
    };

    // Handle Wishlist Toggle
    const handleWishlistClick = async (e, listingId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert("Please log in to save stays to your wishlist!");
            return;
        }
        try {
            await toggleWishlist(listingId);
        } catch (err) {
            console.error("Wishlist error:", err);
        }
    };

    // Initialize Mapbox Map when in Map View
    useEffect(() => {
        if (viewMode !== "map" || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const locatedListings = listings.filter((listing) => {
            const coordinates = listing.geometry?.coordinates;
            return Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(Number.isFinite);
        });
        const defaultCenter = locatedListings[0]?.geometry.coordinates?.slice().reverse() || [20.5937, 78.9629];
        const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(defaultCenter, locatedListings.length > 0 ? 2 : 1);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);
        mapInstanceRef.current = map;

        // Add markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        locatedListings.forEach((listing) => {

            const coordinates = listing.geometry.coordinates;
            const marker = L.marker([coordinates[1], coordinates[0]], {
                icon: L.divIcon({ className: "wh-leaflet-price-marker", html: `<span>₹${(listing.price || 0).toLocaleString("en-IN")}</span>`, iconAnchor: [32, 16] }),
            }).addTo(map);

            marker.on("click", () => {
                setSelectedListing(listing);
                map.flyTo([coordinates[1], coordinates[0]], 11, { animate: true });
            });

            markersRef.current.push(marker);
        });

        if (locatedListings.length > 1) {
            const bounds = L.latLngBounds(locatedListings.map((listing) => [listing.geometry.coordinates[1], listing.geometry.coordinates[0]]));
            map.fitBounds(bounds, { padding: [70, 70], maxZoom: 10, animate: false });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [viewMode, listings]);

    // Average rating calculator
    const getAvgRating = (reviews) => {
        if (!reviews || reviews.length === 0) return "New";
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
        return (sum / reviews.length).toFixed(2);
    };

    return (
        <div className="wh-listings-page">
            {!searchQuery && !searchParams.get("category") && (
                <section className="wh-home-hero">
                    <div className="wh-home-hero-copy">
                        <span className="wh-home-eyebrow"><FaCompass /> Curated stays, made personal</span>
                        <h1>Go somewhere<br /><em>worth remembering.</em></h1>
                        <p>Thoughtful homes, remarkable views, and the little comforts that make a trip feel like yours.</p>
                        <div className="wh-home-hero-actions">
                            <button className="wh-btn wh-btn-primary" onClick={() => navigate("/?category=Rooms")}>
                                Explore stays <FaArrowRight />
                            </button>
                            <Link to="/ai-planner" className="wh-home-secondary-action">Plan with AI <FaArrowRight /></Link>
                        </div>
                        <div className="wh-home-trust-row">
                            <span><FaCheckCircle /> Handpicked places</span>
                            <span><FaCheckCircle /> Flexible booking</span>
                        </div>
                    </div>
                    <div className="wh-home-hero-visual" aria-label="A bright modern home interior">
                        <div className="wh-hero-stamp">FAREBNB<br /><span>FIELD NOTES / 01</span></div>
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1100&q=85"
                            alt="Bright modern home exterior"
                            onError={(event) => {
                                event.currentTarget.src = "https://images.unsplash.com/photo-1600607687920-4e2081cb8e43?auto=format&fit=crop&w=1100&q=85";
                            }}
                        />
                        <div className="wh-hero-location-tag"><span>Featured escape</span><strong>Modern homes, anywhere</strong></div>
                    </div>
                </section>
            )}

            {!searchQuery && !searchParams.get("category") && (
                <section className="wh-stay-brief" aria-labelledby="stay-brief-title">
                    <div className="wh-stay-brief-intro">
                        <span className="wh-section-kicker">Your stay brief</span>
                        <h2 id="stay-brief-title">What kind of room<br /><em>do you need?</em></h2>
                        <p>Start with the feeling. We will take you to the places that match it.</p>
                    </div>
                    <div className="wh-stay-brief-options">
                        {STAY_BRIEFS.map((brief) => (
                            <button
                                key={brief.label}
                                type="button"
                                className="wh-stay-brief-option"
                                onClick={() => navigate(`/?category=${encodeURIComponent(brief.category)}`)}
                            >
                                <span className="wh-brief-icon">{brief.icon}</span>
                                <span className="wh-brief-copy">
                                    <strong>{brief.label}</strong>
                                    <small>{brief.detail}</small>
                                </span>
                                <FaArrowRight className="wh-brief-arrow" />
                            </button>
                        ))}
                    </div>
                    <div className="wh-stay-brief-note"><FaUsers /> Flexible rooms for solo stays, couples, and groups</div>
                </section>
            )}

            {/* Category Navigation Bar */}
            <div className="wh-category-bar-wrapper">
                <div className="wh-category-bar">
                    <div className="wh-category-scroll">
                        {CATEGORIES.map((cat, i) => {
                            const isActive =
                                activeCategory === cat.label ||
                                (cat.label === "All" && !searchParams.get("category"));
                            return (
                                <button
                                    key={i}
                                    className={`wh-cat-chip ${isActive ? "active" : ""}`}
                                    onClick={() => handleCategoryClick(cat.label)}
                                >
                                    <span className="wh-cat-icon">{cat.icon}</span>
                                    <span className="wh-cat-label">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="wh-bar-controls">
                        {searchQuery && (
                            <button
                                className="wh-btn-filter-tag"
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete("search");
                                    setSearchParams(newParams);
                                }}
                            >
                                <span>"{searchQuery}"</span> <FaTimes />
                            </button>
                        )}

                        <div className="wh-tax-switch-card">
                            <span className="wh-tax-label">Display total after taxes</span>
                            <label className="wh-switch">
                                <input
                                    type="checkbox"
                                    checked={showTax}
                                    onChange={() => setShowTax(!showTax)}
                                />
                                <span className="wh-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="wh-loader-container">
                    <div className="wh-loader"></div>
                    <p>Discovering extraordinary stays...</p>
                </div>
            ) : loadError ? (
                <div className="wh-empty-state wh-error-state">
                    <div className="wh-empty-icon"><FaCompass /></div>
                    <h3>We could not load the stays</h3>
                    <p>Make sure the Farebnb server is running, then try again.</p>
                    <button className="wh-btn wh-btn-primary" onClick={() => window.location.reload()}>
                        Try again <FaArrowRight />
                    </button>
                </div>
            ) : viewMode === "map" ? (
                /* Map View */
                <div className="wh-map-view-container">
                    <div ref={mapContainerRef} className="wh-full-mapbox-map" />
                    {selectedListing && (
                        <div className="wh-map-listing-popup">
                            <button
                                className="wh-popup-close-btn"
                                onClick={() => setSelectedListing(null)}
                            >
                                <FaTimes />
                            </button>
                            <Link
                                to={`/listings/${selectedListing._id}`}
                                className="wh-popup-card-content"
                            >
                                <img
                                    src={
                                        selectedListing.image?.url ||
                                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
                                    }
                                    alt={selectedListing.title}
                                    className="wh-popup-img"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"; }}
                                />
                                <div className="wh-popup-info">
                                    <div className="wh-popup-rating">
                                        <FaStar className="wh-star-icon" />
                                        <span>{getAvgRating(selectedListing.reviews)}</span>
                                    </div>
                                    <h4 className="wh-popup-title">{selectedListing.title}</h4>
                                    <p className="wh-popup-location">{selectedListing.location}</p>
                                    <p className="wh-popup-price">
                                        <strong>
                                            ₹
                                            {showTax
                                                ? Math.round(
                                                      selectedListing.price * 1.18
                                                  ).toLocaleString("en-IN")
                                                : selectedListing.price?.toLocaleString("en-IN")}
                                        </strong>{" "}
                                        night
                                    </p>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                /* Main View */
                <>
                    {listings.length > 0 ? (
                        false ? (
                            /* Default Grouped View */
                            <div className="wh-grouped-layout">
                                {Object.entries(
                                    listings.reduce((acc, listing) => {
                                        const loc = listing.location || "Other";
                                        if (!acc[loc]) acc[loc] = [];
                                        acc[loc].push(listing);
                                        return acc;
                                    }, {})
                                ).map(([location, locListings]) => {
                                    const carouselId = `carousel-${location.replace(/[^a-z0-9]/gi, "-")}`;
                                    const scroll = (dir) => {
                                        const carousel = document.getElementById(carouselId);
                                        if (carousel) {
                                            carousel.scrollBy({
                                                left: dir === "left" ? -600 : 600,
                                                behavior: "smooth",
                                            });
                                        }
                                    };
                                    return (
                                        <div key={location} className="wh-location-group">
                                            <div className="wh-location-group-header">
                                                <div className="wh-location-title-row">
                                                    <h2>Available in {location}</h2>
                                                    <button className="wh-location-arrow-btn">→</button>
                                                </div>
                                                <div className="wh-carousel-nav">
                                                    <button className="wh-carousel-btn" onClick={() => scroll("left")}>‹</button>
                                                    <button className="wh-carousel-btn" onClick={() => scroll("right")}>›</button>
                                                </div>
                                            </div>
                                            <div
                                                id={carouselId}
                                                className="wh-horizontal-carousel"
                                            >
                                                {locListings.map((listing, idx) => {
                                                    const isSaved = isWishlisted(listing._id);
                                                    const rating = getAvgRating(listing.reviews);
                                                    const price = showTax
                                                        ? Math.round(listing.price * 1.18)
                                                        : listing.price;
                                                    const price2nights = (price * 2)?.toLocaleString("en-IN");
                                                    const showFavBadge = idx % 3 !== 0; // every 3rd won't have it
                                                    return (
                                                        <div key={listing._id} className="wh-card-wrapper-carousel">
                                                            <Link to={`/listings/${listing._id}`} className="wh-listing-card">
                                                                <div className="wh-card-img-container">
                                                                    <img
                                                                        src={listing.image?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"}
                                                                        alt={listing.title}
                                                                        loading="lazy"
                                                                        className="wh-card-img"
                                                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"; }}
                                                                    />
                                                                    {showFavBadge && (
                                                                        <div className="wh-guest-favourite-badge">Guest favourite</div>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        className={`wh-heart-btn ${isSaved ? "saved" : ""}`}
                                                                        onClick={(e) => handleWishlistClick(e, listing._id)}
                                                                    >
                                                                        {isSaved ? <FaHeart className="wh-heart-filled" /> : <FaRegHeart className="wh-heart-outline" />}
                                                                    </button>
                                                                </div>
                                                                <div className="wh-card-info">
                                                                    <p className="wh-carousel-card-title">{listing.title}</p>
                                                                    <p className="wh-carousel-card-price">
                                                                        ₹{price2nights} for 2 nights
                                                                        <span className="wh-carousel-card-rating">
                                                                            <FaStar className="wh-star-icon" /> {rating}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Grid View for Search/Filters */
                            <div id="stay-collection" className="wh-listings-grid">
                                {listings.map((listing) => {
                                    const isSaved = isWishlisted(listing._id);
                                    const rating = getAvgRating(listing.reviews);
                                    const price = showTax
                                        ? Math.round(listing.price * 1.18)
                                        : listing.price;
                                    return (
                                        <div key={listing._id} className="wh-card-wrapper">
                                            <Link to={`/listings/${listing._id}`} className="wh-listing-card">
                                                <div className="wh-card-img-container">
                                                    <img
                                                        src={listing.image?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"}
                                                        alt={listing.title}
                                                        loading="lazy"
                                                        className="wh-card-img"
                                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"; }}
                                                    />
                                                    <div className="wh-card-top-badges">
                                                        {listing.category && (
                                                            <span className="wh-card-category-badge">{listing.category}</span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className={`wh-heart-btn ${isSaved ? "saved" : ""}`}
                                                            onClick={(e) => handleWishlistClick(e, listing._id)}
                                                        >
                                                            {isSaved ? <FaHeart className="wh-heart-filled" /> : <FaRegHeart className="wh-heart-outline" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="wh-card-info">
                                                    <div className="wh-card-header-row">
                                                        <h3 className="wh-card-loc-text">{listing.location}, {listing.country}</h3>
                                                        <div className="wh-card-rating">
                                                            <FaStar className="wh-star-icon" />
                                                            <span>{rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="wh-card-title-sub">{listing.title}</p>
                                                    <p className="wh-card-specs">{listing.maxGuests || 2} guests · {listing.bedrooms || 1} bed · {listing.bathrooms || 1} bath</p>
                                                    <div className="wh-card-price-row">
                                                        <span className="wh-price-amount">₹{price?.toLocaleString("en-IN")}</span>
                                                        <span className="wh-price-unit"> / night{showTax && " (incl. GST)"}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    ) : (
                        <div className="wh-empty-state">
                            <div className="wh-empty-icon">🏖️</div>
                            <h3>No exact matches found</h3>
                            <p>Try changing your search filters or check out all available stays.</p>
                            <button className="wh-btn wh-btn-outline" onClick={() => setSearchParams({})}>
                                Clear all filters
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Floating Map/List View Toggle */}
            <button
                className="wh-floating-map-btn"
                onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
            >
                {viewMode === "grid" ? (
                    <>
                        <span>Show map</span> <FaMap />
                    </>
                ) : (
                    <>
                        <span>Show list</span> <FaList />
                    </>
                )}
            </button>
        </div>
    );
}

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FaSearch,
    FaBars,
    FaUserCircle,
    FaHeart,
    FaSuitcase,
    FaHome,
    FaPlus,
    FaSignOutAlt,
    FaGlobe,
    FaTimes,
    FaBolt,
    FaMapMarkerAlt,
    FaCompass,
    FaCommentDots
} from "react-icons/fa";
import { TbHomeSpark } from "react-icons/tb";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "./Navbar.css";

const POPULAR_DESTINATIONS = [
    { name: "Chandigarh", desc: "Near you" },
    { name: "Kasauli", desc: "For nature lovers" },
    { name: "Zirakpur", desc: "Near you" },
    { name: "Kharar", desc: "A hidden gem" },
    { name: "Dehradun", desc: "For nature lovers" },
    { name: "Shimla", desc: "Great for winter sports" },
];

export default function Navbar() {
    const { user, logout, demoLogin } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [activeSearchTab, setActiveSearchTab] = useState("where"); // "where", "when", "who"
    const [destination, setDestination] = useState(searchParams.get("search") || "");
    const [guests, setGuests] = useState(1);
    
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const dropdownRef = useRef(null);
    const searchModalRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (searchModalRef.current && !searchModalRef.current.contains(e.target)) {
                // don't close if clicking the search trigger
                if (!e.target.closest(".wh-search-pill")) {
                    setSearchModalOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setSearchModalOpen(false);
        const params = new URLSearchParams();
        if (destination.trim()) params.set("search", destination.trim());
        navigate(`/?${params.toString()}`);
    };

    const handleQuickDestSelect = (loc) => {
        setDestination(loc);
        setSearchModalOpen(false);
        navigate(`/?search=${encodeURIComponent(loc)}`);
    };

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate("/");
    };

    const handleQuickDemo = async (role) => {
        setDropdownOpen(false);
        try {
            await demoLogin(role);
            navigate(role === "host" ? "/host/listings" : "/");
        } catch (err) {
            console.error("Demo login error:", err);
        }
    };

    const handleFindNearby = () => {
        setSearchModalOpen(false);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                navigate(`/?lat=${latitude}&lng=${longitude}`);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please check browser permissions.");
            }
        );
    };

    return (
        <header className="wh-navbar-wrapper">
            <nav className="wh-navbar">
                {/* Brand Logo */}
                <Link to="/" className="wh-brand">
                    <div className="wh-brand-logo-icon">
                        <TbHomeSpark />
                    </div>
                    <span className="wh-brand-text">farebnb</span>
                </Link>

                {/* Airbnb Style Search Pill */}
                <div
                    className="wh-search-pill"
                    onClick={() => {
                        setSearchModalOpen(!searchModalOpen);
                        setActiveSearchTab("where");
                    }}
                >
                    <button type="button" className="wh-search-pill-item bold">
                        {destination || "Anywhere"}
                    </button>
                    <span className="wh-search-pill-divider" />
                    <button type="button" className="wh-search-pill-item" onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); setActiveSearchTab("when"); }}>
                        {dateRange[0].startDate.toDateString() === new Date().toDateString() ? "Any week" : `${dateRange[0].startDate.getDate()} - ${dateRange[0].endDate.getDate()} ${dateRange[0].startDate.toLocaleString('default', { month: 'short' })}`}
                    </button>
                    <span className="wh-search-pill-divider" />
                    <button type="button" className="wh-search-pill-item light" onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); setActiveSearchTab("who"); }}>
                        {guests > 1 ? `${guests} guests` : "Add guests"}
                    </button>
                    <div className="wh-search-pill-btn">
                        <FaSearch />
                    </div>
                </div>

                {/* Right Action Items */}
                <div className="wh-nav-right">
                    <Link to="/ai-planner" className="wh-host-cta" style={{ color: '#ff385c', fontWeight: 'bold' }}>
                        ✨ AI Planner
                    </Link>
                    <Link to="/listings/new" className="wh-host-cta">
                        Airbnb your home
                    </Link>

                    <button
                        className="wh-globe-btn"
                        title="English (US)"
                        onClick={() => alert("Currency: INR (₹), Language: English")}
                    >
                        <FaGlobe />
                    </button>

                    {/* User Menu Dropdown Button */}
                    <div className="wh-user-menu-container" ref={dropdownRef}>
                        <button
                            className="wh-user-menu-btn"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <FaBars className="wh-menu-bars" />
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="wh-user-avatar-img"
                                />
                            ) : (
                                <FaUserCircle className="wh-menu-avatar" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="wh-dropdown-menu">
                                {user ? (
                                    <>
                                        <div className="wh-dropdown-header">
                                            <span className="wh-dropdown-greeting">
                                                Signed in as <strong>{user.username}</strong>
                                            </span>
                                            {user.isSuperhost && (
                                                <span className="wh-badge wh-badge-superhost">
                                                    ★ Superhost
                                                </span>
                                            )}
                                        </div>
                                        <hr className="wh-dropdown-divider" />
                                        <Link
                                            to="/my-trips"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaSuitcase className="wh-item-icon" /> Trips & Reservations
                                        </Link>
                                        <Link
                                            to="/wishlists"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaHeart className="wh-item-icon" /> Wishlists
                                        </Link>
                                        <Link
                                            to="/host/listings"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaHome className="wh-item-icon" /> Host Dashboard
                                        </Link>
                                        <Link
                                            to="/listings/new"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaPlus className="wh-item-icon" /> Create New Listing
                                        </Link>
                                        <Link
                                            to="/messages"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaCommentDots className="wh-item-icon" /> Messages
                                        </Link>
                                        <hr className="wh-dropdown-divider" />
                                        <button
                                            onClick={handleLogout}
                                            className="wh-dropdown-item wh-logout-btn"
                                        >
                                            <FaSignOutAlt className="wh-item-icon" /> Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="wh-demo-login-group">
                                            <span className="wh-demo-label">Quick 1-Click Test:</span>
                                            <button
                                                className="wh-dropdown-item wh-demo-btn"
                                                onClick={() => handleQuickDemo("guest")}
                                            >
                                                <FaBolt className="wh-bolt-icon" /> Login as Guest
                                            </button>
                                            <button
                                                className="wh-dropdown-item wh-demo-btn"
                                                onClick={() => handleQuickDemo("host")}
                                            >
                                                <FaHome className="wh-bolt-icon" /> Login as Superhost
                                            </button>
                                        </div>
                                        <hr className="wh-dropdown-divider" />
                                        <Link
                                            to="/signup"
                                            className="wh-dropdown-item bold"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Sign up
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="wh-dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Expandable Search Modal Dropdown */}
            {searchModalOpen && (
                <div className="wh-search-modal-backdrop">
                    <div className="wh-search-modal-container" ref={searchModalRef}>
                        {/* New Multi-Step Search Bar UI */}
                        <div className="wh-search-bar-stepper">
                            <div 
                                className={`wh-step-item ${activeSearchTab === "where" ? "active" : ""}`}
                                onClick={() => setActiveSearchTab("where")}
                            >
                                <label>Where</label>
                                <input 
                                    type="text" 
                                    placeholder="Search destinations" 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                            <span className="wh-step-divider"></span>
                            <div 
                                className={`wh-step-item ${activeSearchTab === "when" ? "active" : ""}`}
                                onClick={() => setActiveSearchTab("when")}
                            >
                                <label>When</label>
                                <span>Add dates</span>
                            </div>
                            <span className="wh-step-divider"></span>
                            <div 
                                className={`wh-step-item ${activeSearchTab === "who" ? "active" : ""}`}
                                onClick={() => setActiveSearchTab("who")}
                            >
                                <label>Who</label>
                                <span>{guests > 1 ? `${guests} guests` : "Add guests"}</span>
                            </div>
                            <button className="wh-search-submit-btn-round" onClick={handleSearchSubmit}>
                                <FaSearch /> Search
                            </button>
                        </div>

                        {/* Search Modal Content Panels */}
                        <div className="wh-search-modal-content">
                            {activeSearchTab === "where" && (
                                <div className="wh-popular-destinations">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <h4>Suggested destinations</h4>
                                        <button onClick={handleFindNearby} className="wh-btn wh-btn-outline wh-btn-sm" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaMapMarkerAlt /> Find Stays Near Me
                                        </button>
                                    </div>
                                    <div className="wh-dest-chips-grid">
                                        {POPULAR_DESTINATIONS.map((d, i) => (
                                            <button
                                                key={i}
                                                className="wh-dest-chip-card"
                                                onClick={() => handleQuickDestSelect(d.name)}
                                            >
                                                <div className="wh-dest-icon"><TbHomeSpark /></div>
                                                <div className="wh-dest-text">
                                                    <strong>{d.name}</strong>
                                                    <span>{d.desc}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSearchTab === "when" && (
                                <div className="wh-date-picker-container">
                                    <DateRangePicker
                                        ranges={dateRange}
                                        onChange={item => setDateRange([item.selection])}
                                        months={2}
                                        direction="horizontal"
                                        minDate={new Date()}
                                    />
                                </div>
                            )}

                            {activeSearchTab === "who" && (
                                <div className="wh-guest-selector">
                                    <div className="wh-guest-row">
                                        <div className="wh-guest-info">
                                            <h4>Adults</h4>
                                            <span>Ages 13 or above</span>
                                        </div>
                                        <div className="wh-guest-stepper">
                                            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}>-</button>
                                            <span>{guests}</span>
                                            <button type="button" onClick={() => setGuests(guests + 1)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

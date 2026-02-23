import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCompass, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav className="wh-navbar">
            <div className="wh-navbar-inner">
                <Link to="/" className="wh-brand">
                    <FaCompass className="wh-brand-icon" />
                    <span>WanderHome<span className="wh-brand-subtext">24×7</span></span>
                </Link>

                <button
                    className="wh-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`wh-nav-links ${mobileOpen ? "open" : ""}`}>
                    <a href="/" className="wh-nav-link" onClick={() => setMobileOpen(false)}>
                        Explore
                    </a>

                    <form className="wh-search-box" onSubmit={(e) => {
                        e.preventDefault();
                        const query = e.target.search.value;
                        if (query) navigate(`/?search=${query}`);
                        else navigate(`/`);
                        setMobileOpen(false);
                    }}>
                        <FaSearch className="wh-search-icon" />
                        <input
                            name="search"
                            type="text"
                            placeholder="Search destinations..."
                            className="wh-search-input"
                        />
                    </form>

                    <div className="wh-nav-actions">
                        {user ? (
                            <>
                                <Link
                                    to="/my-trips"
                                    className="wh-nav-link"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    My Trips
                                </Link>
                                <Link
                                    to="/listings/new"
                                    className="wh-nav-link wh-host-link"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    List your Home
                                </Link>
                                <span className="wh-user-badge">
                                    Hi, {user.username}
                                </span>
                                <button onClick={handleLogout} className="wh-btn wh-btn-outline">
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="wh-btn wh-btn-primary"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign up
                                </Link>
                                <Link
                                    to="/login"
                                    className="wh-btn wh-btn-outline"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

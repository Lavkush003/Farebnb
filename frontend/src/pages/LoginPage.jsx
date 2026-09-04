import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import { FaBolt, FaHome, FaArrowLeft } from "react-icons/fa";
import { TbHomeSpark } from "react-icons/tb";
import "./FormPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, demoLogin } = useAuth();
    const [flash, setFlash] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(form);
            navigate("/");
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Invalid username or password",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDemo = async (role) => {
        setSubmitting(true);
        try {
            await demoLogin(role);
            navigate(role === "host" ? "/host/listings" : "/");
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Demo login failed",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-form-page-wrapper wh-login-page">
            <aside className="wh-login-visual">
                <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85"
                    alt="Sunlit room prepared for a stay"
                />
                <div className="wh-login-visual-overlay">
                    <span className="wh-login-visual-kicker">A better way to arrive</span>
                    <h1>Find a room<br /><em>that feels like yours.</em></h1>
                    <p>Keep your favorite stays close and your next check-in simple.</p>
                    <span className="wh-login-visual-mark">FAREBNB / FIELD NOTES</span>
                </div>
            </aside>
            <div className="wh-auth-card">
                <Link to="/" className="wh-form-back-btn">
                    <FaArrowLeft /> Back to home
                </Link>

                <div className="wh-auth-brand-icon">
                    <TbHomeSpark />
                </div>

                <h2 className="wh-auth-title">Welcome back to Farebnb</h2>
                <p className="wh-auth-sub">
                    Log in to access your bookings, wishlists, and host dashboard
                </p>

                {flash && (
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={() => setFlash(null)}
                    />
                )}

                {/* 1-Click Demo Login Shortcuts */}
                <div className="wh-demo-quick-box">
                    <span className="wh-demo-quick-title">⚡ 1-Click Instant Demo Testing:</span>
                    <div className="wh-demo-btn-row">
                        <button
                            type="button"
                            className="wh-demo-action-btn guest"
                            onClick={() => handleDemo("guest")}
                            disabled={submitting}
                        >
                            <FaBolt /> Login as Traveler
                        </button>
                        <button
                            type="button"
                            className="wh-demo-action-btn host"
                            onClick={() => handleDemo("host")}
                            disabled={submitting}
                        >
                            <FaHome /> Login as Superhost
                        </button>
                    </div>
                </div>

                <div className="wh-auth-divider">
                    <span>or continue with credentials</span>
                </div>

                <form onSubmit={handleSubmit} className="wh-auth-form">
                    <div className="wh-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="wh-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="wh-btn wh-btn-primary wh-btn-full wh-auth-submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? "Signing in..." : "Log in"}
                    </button>
                </form>

                <div className="wh-auth-footer-text">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api";
import FlashMessage from "../components/FlashMessage";
import { FcGoogle } from "react-icons/fc";
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
        <div className="wh-form-page-wrapper">
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

                <div className="wh-auth-divider">
                    <span>or</span>
                </div>

                <button
                    type="button"
                    className="wh-btn wh-btn-outline wh-btn-full wh-google-auth-btn"
                    onClick={() => (window.location.href = `${API_BASE_URL}/users/google`)}
                >
                    <FcGoogle className="wh-google-icon" />
                    Continue with Google
                </button>

                <div className="wh-auth-footer-text">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

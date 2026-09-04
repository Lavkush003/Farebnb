import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import { FaArrowLeft } from "react-icons/fa";
import { TbHomeSpark } from "react-icons/tb";
import "./FormPage.css";

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [flash, setFlash] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await signup(form);
            navigate("/");
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Signup failed. Please try a different username.",
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

                <h2 className="wh-auth-title">Join the Farebnb Community</h2>
                <p className="wh-auth-sub">
                    Create an account and discover extraordinary homes worldwide
                </p>

                {flash && (
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={() => setFlash(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="wh-auth-form">
                    <div className="wh-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="e.g. johndoe"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="wh-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
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
                            placeholder="At least 6 characters"
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
                        {submitting ? "Creating your account..." : "Sign up"}
                    </button>
                </form>

                <div className="wh-auth-footer-text">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}

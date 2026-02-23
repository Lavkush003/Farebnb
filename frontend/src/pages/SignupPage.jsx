import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import { FcGoogle } from "react-icons/fc";
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
            navigate("/login");
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Signup failed",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-form-page">
            <div className="wh-form-card">
                <h2 className="wh-form-title">Join WanderHome</h2>
                <p className="wh-form-subtitle">
                    Create an account and start exploring
                </p>

                {flash && (
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={() => setFlash(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="wh-form">
                    <div className="wh-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="wh-input-group">
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

                    <div className="wh-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="wh-btn wh-btn-primary wh-btn-full"
                        disabled={submitting}
                    >
                        {submitting ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div className="wh-divider">
                    <span>OR</span>
                </div>

                <button
                    type="button"
                    className="wh-btn wh-btn-google wh-btn-full"
                    onClick={() => window.location.href = "http://localhost:8080/api/users/google"}
                >
                    <FcGoogle className="wh-google-icon" />
                    Continue with Google
                </button>

                <div className="wh-auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}

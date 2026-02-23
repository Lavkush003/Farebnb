import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import { FcGoogle } from "react-icons/fc";
import "./FormPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
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
                message: err.response?.data?.error || "Invalid credentials",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-form-page">
            <div className="wh-form-card">
                <h2 className="wh-form-title">Welcome back!</h2>
                <p className="wh-form-subtitle">
                    Log in to your WanderHome account
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
                            placeholder="Enter your username"
                            value={form.username}
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
                            placeholder="Enter your password"
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
                        {submitting ? "Logging in..." : "Log in"}
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
                    Don't have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

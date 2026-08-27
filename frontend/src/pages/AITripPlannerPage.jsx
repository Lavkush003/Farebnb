import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { planTripAi } from "../api";
import { FaMagic, FaArrowRight, FaMapMarkerAlt, FaStar, FaSpinner } from "react-icons/fa";
import "./AITripPlanner.css";

export default function AITripPlannerPage() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handlePlan = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await planTripAi(prompt);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to generate your trip plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (text) => {
        setPrompt(text);
    };

    return (
        <div className="wh-ai-planner-container">
            <div className="wh-ai-header">
                <div className="wh-ai-sparkle-icon">
                    <FaMagic />
                </div>
                <h1>Farebnb AI Trip Planner</h1>
                <p>Describe your dream vacation, and our AI will instantly build an itinerary and match you with the perfect stays.</p>
            </div>

            <div className="wh-ai-input-section">
                <form onSubmit={handlePlan} className="wh-ai-search-box">
                    <input
                        type="text"
                        placeholder="e.g. A romantic 3-day weekend in the hills under ₹20,000"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading || !prompt.trim()}>
                        {loading ? <FaSpinner className="wh-spin" /> : "Plan Trip"}
                    </button>
                </form>

                <div className="wh-ai-suggestions">
                    <span className="wh-sug-label">Try asking:</span>
                    <button type="button" onClick={() => handleQuickPrompt("Family-friendly beach vacation for 4 days")}>
                        Family beach trip
                    </button>
                    <button type="button" onClick={() => handleQuickPrompt("A cozy cabin in the snow for a solo retreat")}>
                        Solo snow retreat
                    </button>
                    <button type="button" onClick={() => handleQuickPrompt("Luxury villa with a pool in Goa")}>
                        Luxury pool villa
                    </button>
                </div>
            </div>

            {error && <div className="wh-ai-error-message">{error}</div>}

            {result && (
                <div className="wh-ai-result-section">
                    <div className="wh-ai-itinerary-card">
                        <h2>{result.itineraryTitle}</h2>
                        <p>{result.itineraryDescription}</p>
                    </div>

                    <h3 className="wh-ai-recommended-heading">Recommended Stays for Your Trip</h3>
                    <div className="wh-ai-listings-grid">
                        {result.listings && result.listings.length > 0 ? (
                            result.listings.map((listing) => (
                                <div key={listing._id} className="wh-ai-listing-card" onClick={() => navigate(`/listings/${listing._id}`)}>
                                    <div className="wh-ai-card-img-wrapper">
                                        <img 
                                            src={listing.image?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"} 
                                            alt={listing.title} 
                                        />
                                        <div className="wh-ai-card-badge">AI Pick</div>
                                    </div>
                                    <div className="wh-ai-card-body">
                                        <div className="wh-ai-card-loc">
                                            <FaMapMarkerAlt /> {listing.location}, {listing.country}
                                        </div>
                                        <h4>{listing.title}</h4>
                                        <div className="wh-ai-card-footer">
                                            <span className="wh-ai-price">
                                                <strong>₹{listing.price?.toLocaleString("en-IN")}</strong> / night
                                            </span>
                                            <span className="wh-ai-rating">
                                                <FaStar /> 5.0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="wh-ai-no-match">We couldn't find any listings that perfectly match this prompt right now.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

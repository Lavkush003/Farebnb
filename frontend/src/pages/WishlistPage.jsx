import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, toggleWishlist } from "../api";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaStar, FaTrash } from "react-icons/fa";
import "./Wishlist.css";

export default function WishlistPage() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchWishlist();
    }, [user, navigate]);

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            setWishlistItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e, listingId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await toggleWishlist(listingId);
            setWishlistItems(prev => prev.filter(item => item._id !== listingId));
            if (refreshUser) refreshUser();
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading your saved stays...</p>
            </div>
        );
    }

    return (
        <div className="wh-wishlist-page">
            <div className="wh-wishlist-header">
                <h1>Wishlists</h1>
                <p>All your favorite saved stays in one place</p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="wh-wishlist-empty-state">
                    <div className="wh-empty-heart-icon"><FaHeart /></div>
                    <h3>Your wishlist is empty</h3>
                    <p>
                        As you search, tap the heart icon on any stay to save your favorite places to stay or things to do.
                    </p>
                    <Link to="/" className="wh-btn wh-btn-primary">
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="wh-wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="wh-wishlist-card-wrapper">
                            <Link to={`/listings/${item._id}`} className="wh-wishlist-card">
                                <div className="wh-wishlist-img-box">
                                    <img
                                        src={
                                            item.image?.url ||
                                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                                        }
                                        alt={item.title}
                                        className="wh-wishlist-img"
                                    />
                                    <button
                                        type="button"
                                        className="wh-wishlist-remove-btn"
                                        onClick={(e) => handleRemove(e, item._id)}
                                        title="Remove from Wishlist"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="wh-wishlist-info">
                                    <div className="wh-wishlist-row">
                                        <h4>{item.location}, {item.country}</h4>
                                        <div className="wh-wishlist-rating">
                                            <FaStar className="wh-star-sm" />
                                            <span>
                                                {item.reviews?.length > 0
                                                    ? (
                                                          item.reviews.reduce(
                                                              (a, b) => a + (b.rating || 5),
                                                              0
                                                          ) / item.reviews.length
                                                      ).toFixed(1)
                                                    : "5.0"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="wh-wishlist-title-sub">{item.title}</p>
                                    <p className="wh-wishlist-price">
                                        <strong>₹{item.price?.toLocaleString("en-IN")}</strong> / night
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

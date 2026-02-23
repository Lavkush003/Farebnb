// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { getListing, deleteListing, createReview, deleteReview } from "../api";
// import { useAuth } from "../context/AuthContext";
// import FlashMessage from "../components/FlashMessage";
// import BookingWidget from "../components/BookingWidget";
// import { FaStar, FaMapMarkerAlt, FaUser, FaTrash, FaEdit } from "react-icons/fa";
// import "./ShowListing.css";

// export default function ShowListingPage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const [listing, setListing] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [flash, setFlash] = useState(null);

//     // Review form
//     const [rating, setRating] = useState(3);
//     const [comment, setComment] = useState("");
//     const [submitting, setSubmitting] = useState(false);

//     const mapContainer = useRef(null);
//     const map = useRef(null);

//     useEffect(() => {
//         fetchListing();
//     }, [id]);

//     useEffect(() => {
//         if (!listing || !listing.geometry || !listing.geometry.coordinates || !mapContainer.current) return;
//         if (map.current) return; // initialize map only once

//         mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

//         const [lng, lat] = listing.geometry.coordinates;

//         map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: 'mapbox://styles/mapbox/streets-v12',
//             center: [lng, lat],
//             zoom: 12
//         });

//         map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

//         const popup = new mapboxgl.Popup({ offset: 25 })
//             .setHTML(`
//                 <h4 style="margin: 0 0 5px 0; color: #1a1a2e; font-size: 14px;">${listing.title}</h4>
//                 <p style="margin: 0; color: #666; font-size: 13px;">${listing.location}, ${listing.country}</p>
//             `);

//         new mapboxgl.Marker({ color: "#e63946" })
//             .setLngLat([lng, lat])
//             .setPopup(popup)
//             .addTo(map.current);

//     }, [listing]);

//     const fetchListing = async () => {
//         try {
//             const res = await getListing(id);
//             setListing(res.data);
//         } catch (err) {
//             setFlash({ message: "Listing not found", type: "error" });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (!window.confirm("Are you sure you want to delete this listing?")) return;
//         try {
//             await deleteListing(id);
//             navigate("/");
//         } catch (err) {
//             setFlash({ message: "Failed to delete listing", type: "error" });
//         }
//     };

//     const handleReviewSubmit = async (e) => {
//         e.preventDefault();
//         if (!comment.trim()) return;
//         setSubmitting(true);
//         try {
//             await createReview(id, { review: { rating, comment } });
//             setComment("");
//             setRating(3);
//             setFlash({ message: "Review added!", type: "success" });
//             fetchListing(); // refresh
//         } catch (err) {
//             setFlash({
//                 message: err.response?.data?.error || "Failed to add review",
//                 type: "error",
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleDeleteReview = async (reviewId) => {
//         try {
//             await deleteReview(id, reviewId);
//             setFlash({ message: "Review deleted!", type: "success" });
//             fetchListing();
//         } catch (err) {
//             setFlash({ message: "Failed to delete review", type: "error" });
//         }
//     };

//     if (loading) {
//         return (
//             <div className="wh-loader-container">
//                 <div className="wh-loader"></div>
//                 <p>Loading listing...</p>
//             </div>
//         );
//     }

//     if (!listing) {
//         return (
//             <div className="wh-show-page">
//                 <FlashMessage message="Listing not found" type="error" />
//                 <Link to="/" className="wh-back-link">← Back to listings</Link>
//             </div>
//         );
//     }

//     const isOwner = user && listing.owner && user._id === listing.owner._id;

//     return (
//         <div className="wh-show-page">
//             {flash && (
//                 <FlashMessage
//                     message={flash.message}
//                     type={flash.type}
//                     onClose={() => setFlash(null)}
//                 />
//             )}

//             <Link to="/" className="wh-back-link">← Back to all listings</Link>

//             <div className="wh-show-header">
//                 <h1 className="wh-show-title">{listing.title}</h1>
//                 {isOwner && (
//                     <div className="wh-show-actions">
//                         <Link to={`/listings/${id}/edit`} className="wh-btn-icon wh-btn-edit">
//                             <FaEdit /> Edit
//                         </Link>
//                         <button onClick={handleDelete} className="wh-btn-icon wh-btn-delete">
//                             <FaTrash /> Delete
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <div className="wh-show-image-container">
//                 <img
//                     src={listing.image?.url}
//                     alt={listing.title}
//                     className="wh-show-image"
//                 />
//             </div>

//             <div className="wh-show-content">
//                 <div className="wh-show-main">
//                     <div className="wh-show-meta">
//                         <div className="wh-show-owner">
//                             <FaUser className="wh-meta-icon" />
//                             <span>Hosted by <strong>{listing.owner?.username || "Unknown"}</strong></span>
//                         </div>
//                         <div className="wh-show-location">
//                             <FaMapMarkerAlt className="wh-meta-icon" />
//                             <span>{listing.location}, {listing.country}</span>
//                         </div>
//                     </div>

//                     <p className="wh-show-desc">{listing.description}</p>

//                     <div className="wh-show-price-box">
//                         <span className="wh-show-price-amount">
//                             ₹{listing.price?.toLocaleString("en-IN")}
//                         </span>
//                         <span className="wh-show-price-label">per night</span>
//                     </div>
//                 </div>

//                 {/* Reviews Section */}
//                 <div className="wh-show-reviews">
//                     {user && (
//                         <div className="wh-review-form-card">
//                             <h3>Leave a Review</h3>
//                             <form onSubmit={handleReviewSubmit}>
//                                 <div className="wh-star-rating">
//                                     <label>Rating</label>
//                                     <div className="wh-stars">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button
//                                                 key={star}
//                                                 type="button"
//                                                 className={`wh-star-btn ${rating >= star ? "active" : ""}`}
//                                                 onClick={() => setRating(star)}
//                                             >
//                                                 <FaStar />
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div className="wh-review-input-group">
//                                     <label>Comment</label>
//                                     <textarea
//                                         value={comment}
//                                         onChange={(e) => setComment(e.target.value)}
//                                         placeholder="Share your experience..."
//                                         rows="4"
//                                         required
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     className="wh-btn wh-btn-primary wh-btn-full"
//                                     disabled={submitting}
//                                 >
//                                     {submitting ? "Submitting..." : "Submit Review"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}

//                     {listing.reviews && listing.reviews.length > 0 && (
//                         <div className="wh-reviews-list">
//                             <h3>All Reviews ({listing.reviews.length})</h3>
//                             {listing.reviews.map((review) => (
//                                 <div key={review._id} className="wh-review-card">
//                                     <div className="wh-review-head">
//                                         <span className="wh-review-author">
//                                             @{review.author?.username || "anonymous"}
//                                         </span>
//                                         <div className="wh-review-stars">
//                                             {Array.from({ length: review.rating }, (_, i) => (
//                                                 <FaStar key={i} className="wh-star-filled" />
//                                             ))}
//                                             {Array.from({ length: 5 - review.rating }, (_, i) => (
//                                                 <FaStar key={i} className="wh-star-empty" />
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <p className="wh-review-comment">{review.comment}</p>
//                                     {user && review.author && user._id === review.author._id && (
//                                         <button
//                                             onClick={() => handleDeleteReview(review._id)}
//                                             className="wh-review-delete"
//                                         >
//                                             <FaTrash /> Delete
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Map Section */}
//                 {listing.geometry && listing.geometry.coordinates && (
//                     <div className="wh-show-map-container">
//                         <h3>Where you'll be</h3>
//                         <div
//                             ref={mapContainer}
//                             style={{ width: "100%", height: 400, borderRadius: "16px", overflow: "hidden" }}
//                         />
//                     </div>
//                 )}
//             </div>
//             {/* Booking Side Panel */}
//             <div className="wh-show-sidebar">
//                 <BookingWidget listing={listing} />
//             </div>
//         </div>
//     );
// }

















import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
    getListing,
    deleteListing,
    createReview,
    deleteReview,
} from "../api";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import BookingWidget from "../components/BookingWidget";
import {
    FaStar,
    FaMapMarkerAlt,
    FaUser,
    FaTrash,
    FaEdit,
} from "react-icons/fa";
import "./ShowListing.css";

export default function ShowListingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flash, setFlash] = useState(null);

    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);

    /* ================= FETCH LISTING ================= */

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await getListing(id);
                setListing(res.data);
            } catch (err) {
                setFlash({ message: "Listing not found", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    /* ================= MAPBOX SAFE INIT ================= */

    useEffect(() => {
        if (!listing) return;

        // Safe guard for geometry
        const coords = listing?.geometry?.coordinates;

        if (
            !coords ||
            !Array.isArray(coords) ||
            coords.length !== 2 ||
            typeof coords[0] !== "number" ||
            typeof coords[1] !== "number" ||
            !mapContainer.current
        ) {
            return;
        }

        if (map.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

        const [lng, lat] = coords;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: 12,
        });

        map.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right"
        );

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h4 style="margin:0 0 5px 0;">${listing.title}</h4>
        <p style="margin:0;">${listing.location}, ${listing.country}</p>
    `);

        new mapboxgl.Marker({ color: "#e63946" })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current);

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [listing]);

    /* ================= DELETE LISTING ================= */

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this listing?"))
            return;

        try {
            await deleteListing(id);
            navigate("/");
        } catch (err) {
            setFlash({ message: "Failed to delete listing", type: "error" });
        }
    };

    /* ================= REVIEW SUBMIT ================= */

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await createReview(id, { review: { rating, comment } });
            setComment("");
            setRating(3);
            setFlash({ message: "Review added!", type: "success" });

            const res = await getListing(id);
            setListing(res.data);
        } catch (err) {
            setFlash({
                message:
                    err.response?.data?.error || "Failed to add review",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(id, reviewId);
            const res = await getListing(id);
            setListing(res.data);
            setFlash({ message: "Review deleted!", type: "success" });
        } catch {
            setFlash({ message: "Failed to delete review", type: "error" });
        }
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading listing...</p>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="wh-show-page">
                <FlashMessage message="Listing not found" type="error" />
                <Link to="/" className="wh-back-link">
                    ← Back to listings
                </Link>
            </div>
        );
    }

    const isOwner =
        user && listing.owner && user._id === listing.owner._id;

    /* ================= UI ================= */

    return (
        <div className="wh-show-page">
            {flash && (
                <FlashMessage
                    message={flash.message}
                    type={flash.type}
                    onClose={() => setFlash(null)}
                />
            )}

            <Link to="/" className="wh-back-link">
                ← Back to all listings
            </Link>

            <h1 className="wh-show-title">{listing.title}</h1>

            <div className="wh-show-image-container">
                <img
                    src={listing.image?.url}
                    alt={listing.title}
                    className="wh-show-image"
                />
            </div>

            <p className="wh-show-desc">{listing.description}</p>

            <div className="wh-show-price-box">
                ₹{listing.price?.toLocaleString("en-IN")} per night
            </div>

            {/* MAP (Only renders if geometry exists) */}
            {listing?.geometry?.coordinates && (
                <div className="wh-show-map-container">
                    <h3>Where you'll be</h3>
                    <div
                        ref={mapContainer}
                        style={{
                            width: "100%",
                            height: 400,
                            borderRadius: "16px",
                            overflow: "hidden",
                        }}
                    />
                </div>
            )}

            {/* Reviews */}
            {listing.reviews?.length > 0 && (
                <div>
                    <h3>Reviews</h3>
                    {listing.reviews.map((review) => (
                        <div key={review._id}>
                            <strong>
                                @{review.author?.username || "anonymous"}
                            </strong>
                            <p>{review.comment}</p>
                            {user &&
                                review.author &&
                                user._id === review.author._id && (
                                    <button
                                        onClick={() =>
                                            handleDeleteReview(review._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                )}
                        </div>
                    ))}
                </div>
            )}

            {/* Booking */}
            <BookingWidget listing={listing} />
        </div>
    );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListing, updateListing } from "../api";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import "./FormPage.css";

export default function EditListingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [flash, setFlash] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
    });
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getListing(id);
                const l = res.data;
                setForm({
                    title: l.title || "",
                    description: l.description || "",
                    price: l.price || "",
                    location: l.location || "",
                    country: l.country || "",
                });
                if (l.image?.url) {
                    setCurrentImage(l.image.url.replace("/upload", "/upload/w_250"));
                }
            } catch {
                setFlash({ message: "Failed to load listing", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("location", form.location);
            formData.append("country", form.country);
            if (image) {
                formData.append("image", image);
            }

            await updateListing(id, formData);
            navigate(`/listings/${id}`);
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Failed to update listing",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="wh-loader-container">
                <div className="wh-loader"></div>
                <p>Loading listing...</p>
            </div>
        );
    }

    return (
        <div className="wh-form-page">
            <div className="wh-form-card">
                <h2 className="wh-form-title">Edit your Listing</h2>
                <p className="wh-form-subtitle">
                    Update the details of your property
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
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="wh-input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    {currentImage && (
                        <div className="wh-current-image">
                            <label>Current Image</label>
                            <img src={currentImage} alt="Current listing" />
                        </div>
                    )}

                    <div className="wh-input-group">
                        <label htmlFor="image">Upload New Image</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="wh-file-input"
                        />
                    </div>

                    <div className="wh-input-row">
                        <div className="wh-input-group">
                            <label htmlFor="price">Price (₹/night)</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="wh-input-group">
                            <label htmlFor="country">Country</label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={form.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="wh-input-group">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="wh-btn wh-btn-primary wh-btn-full"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update Listing"}
                    </button>
                </form>
            </div>
        </div>
    );
}

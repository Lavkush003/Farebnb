import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import "./FormPage.css";

export default function NewListingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [flash, setFlash] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
    });
    const [image, setImage] = useState(null);

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

            const res = await createListing(formData);
            navigate(`/listings/${res.data._id}`);
        } catch (err) {
            setFlash({
                message: err.response?.data?.error || "Failed to create listing",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-form-page">
            <div className="wh-form-card">
                <h2 className="wh-form-title">Create a New Listing</h2>
                <p className="wh-form-subtitle">
                    Share your space with travellers around the world
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
                            placeholder="Add a catchy title"
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
                            placeholder="Describe your place..."
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    <div className="wh-input-group">
                        <label htmlFor="image">Upload Image</label>
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
                                placeholder="1200"
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
                                placeholder="India"
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
                            placeholder="Jaipur, Rajasthan"
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
                        {submitting ? "Creating..." : "Create Listing"}
                    </button>
                </form>
            </div>
        </div>
    );
}

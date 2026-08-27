import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getListing, updateListing } from "../api";
import { useAuth } from "../context/AuthContext";
import FlashMessage from "../components/FlashMessage";
import { FaUpload, FaCheck, FaArrowLeft } from "react-icons/fa";
import "./FormPage.css";

const CATEGORIES = [
    "Trending",
    "Beachfront",
    "Mountains",
    "Amazing Pools",
    "Iconic Cities",
    "Castles",
    "Rooms",
    "Camping",
    "Arctic",
    "Farms",
    "Domes",
    "Boats",
];

const AVAILABLE_AMENITIES = [
    "Wifi",
    "Kitchen",
    "Air conditioning",
    "Free parking",
    "Pool",
    "Hot tub",
    "Dedicated workspace",
    "TV",
    "Coffee maker",
    "Indoor fireplace",
    "Breakfast included",
    "Pet friendly",
    "Washer",
    "Dryer",
    "Patio or balcony",
    "BBQ grill",
    "Heating",
    "Sauna",
    "Garden view",
    "Mountain view",
    "Lake view",
    "Sea view",
    "EV charger",
    "Elevator",
    "Fire pit",
    "Telescope",
    "Gym",
    "Daily housekeeping",
    "Waterfront",
    "Kayaks provided",
    "Spa services",
    "Courtyard view",
    "Tea room",
    "Open air shower",
    "River view",
    "Japanese bath",
    "Shikara ride",
    "Ski-in/Ski-out",
];

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
        category: "Trending",
        price: "",
        location: "",
        country: "",
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        maxGuests: 2,
        imageUrl: "",
    });

    const [amenities, setAmenities] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getListing(id);
                const l = res.data;
                setForm({
                    title: l.title || "",
                    description: l.description || "",
                    category: l.category || "Trending",
                    price: l.price || "",
                    location: l.location || "",
                    country: l.country || "",
                    bedrooms: l.bedrooms || 1,
                    beds: l.beds || 1,
                    bathrooms: l.bathrooms || 1,
                    maxGuests: l.maxGuests || 2,
                    imageUrl: "",
                });
                setAmenities(l.amenities || []);
                if (l.image?.url) {
                    setCurrentImage(l.image.url);
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

    const handleAmenityToggle = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((a) => a !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("location", form.location);
            formData.append("country", form.country);
            formData.append("bedrooms", form.bedrooms);
            formData.append("beds", form.beds);
            formData.append("bathrooms", form.bathrooms);
            formData.append("maxGuests", form.maxGuests);
            formData.append("amenities", JSON.stringify(amenities));

            if (imageFile) {
                formData.append("image", imageFile);
            } else if (form.imageUrl) {
                formData.append("imageUrl", form.imageUrl);
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
                <p>Loading property details...</p>
            </div>
        );
    }

    return (
        <div className="wh-form-page-wrapper">
            <div className="wh-form-container">
                <Link to={`/listings/${id}`} className="wh-form-back-btn">
                    <FaArrowLeft /> Back to property
                </Link>

                <div className="wh-form-header">
                    <h2>Edit your Listing</h2>
                    <p>Update property details, pricing, and amenities.</p>
                </div>

                {flash && (
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={() => setFlash(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="wh-listing-form">
                    <div className="wh-form-section">
                        <h3>1. Basic Information</h3>
                        <div className="wh-form-group">
                            <label htmlFor="title">Property Title *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="wh-form-row">
                            <div className="wh-form-group">
                                <label htmlFor="category">Property Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="wh-form-group">
                                <label htmlFor="price">Price per Night (₹) *</label>
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
                        </div>

                        <div className="wh-form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="wh-form-section">
                        <h3>2. Location</h3>
                        <div className="wh-form-row">
                            <div className="wh-form-group">
                                <label htmlFor="location">City / State *</label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="wh-form-group">
                                <label htmlFor="country">Country *</label>
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
                    </div>

                    <div className="wh-form-section">
                        <h3>3. Room & Guest Capacity</h3>
                        <div className="wh-form-grid-4">
                            <div className="wh-form-group">
                                <label>Max Guests</label>
                                <input
                                    name="maxGuests"
                                    type="number"
                                    min="1"
                                    value={form.maxGuests}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="wh-form-group">
                                <label>Bedrooms</label>
                                <input
                                    name="bedrooms"
                                    type="number"
                                    min="1"
                                    value={form.bedrooms}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="wh-form-group">
                                <label>Beds</label>
                                <input
                                    name="beds"
                                    type="number"
                                    min="1"
                                    value={form.beds}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="wh-form-group">
                                <label>Bathrooms</label>
                                <input
                                    name="bathrooms"
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={form.bathrooms}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="wh-form-section">
                        <h3>4. Amenities</h3>
                        <div className="wh-amenities-checkbox-grid">
                            {AVAILABLE_AMENITIES.map((item) => {
                                const checked = amenities.includes(item);
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`wh-amenity-select-card ${checked ? "selected" : ""}`}
                                        onClick={() => handleAmenityToggle(item)}
                                    >
                                        <span className="wh-amenity-checkbox">
                                            {checked && <FaCheck />}
                                        </span>
                                        <span>{item}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="wh-form-section">
                        <h3>5. Photos</h3>
                        {currentImage && (
                            <div className="wh-current-img-preview">
                                <label>Current Photo:</label>
                                <img src={currentImage} alt="Current property view" />
                            </div>
                        )}
                        <div className="wh-form-group">
                            <label htmlFor="imageFile">Replace Photo (Optional)</label>
                            <div className="wh-file-dropzone">
                                <FaUpload className="wh-upload-icon" />
                                <span>{imageFile ? imageFile.name : "Choose a new photo"}</span>
                                <input
                                    id="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="wh-btn wh-btn-primary wh-btn-full wh-submit-listing-btn"
                        disabled={submitting}
                    >
                        {submitting ? "Updating listing..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

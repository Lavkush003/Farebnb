import axios from "axios";

const API = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

// ===== LISTINGS =====
export const getAllListings = () => API.get("/listings");
export const getListing = (id) => API.get(`/listings/${id}`);
export const createListing = (formData) =>
    API.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const updateListing = (id, formData) =>
    API.put(`/listings/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const deleteListing = (id) => API.delete(`/listings/${id}`);

// ===== REVIEWS =====
export const createReview = (listingId, reviewData) =>
    API.post(`/listings/${listingId}/reviews`, reviewData);
export const deleteReview = (listingId, reviewId) =>
    API.delete(`/listings/${listingId}/reviews/${reviewId}`);

// ===== USERS =====
export const getCurrentUser = () => API.get("/users/current");
export const signup = (userData) => API.post("/users/signup", userData);
export const login = (credentials) => API.post("/users/login", credentials);
export const logout = () => API.post("/users/logout");

// ===== BOOKINGS =====
export const createBooking = (listingId, bookingData) =>
    API.post(`/bookings/${listingId}`, bookingData);
export const getUserBookings = () => API.get("/bookings/user");

export default API;

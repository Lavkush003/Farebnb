const { data: sampleData } = require("../init/data.js");

class InMemoryStore {
    constructor() {
        this.users = [];
        this.listings = [];
        this.reviews = [];
        this.bookings = [];
        this.messages = []; // [{ _id, room, sender, text, createdAt }]
        this.init();
    }

    init() {
        // Create demo host user
        const host = {
            _id: "host_user_001",
            username: "wander_host",
            email: "host@farebnb.com",
            password: "host1234",
            isSuperhost: true,
            bio: "Superhost with 6+ years hosting luxury properties around the world.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            wishlist: [],
            createdAt: new Date(),
        };
        this.users.push(host);

        // Create demo traveler user
        const traveler = {
            _id: "traveler_user_001",
            username: "alex_traveler",
            email: "alex@farebnb.com",
            password: "guest1234",
            isSuperhost: false,
            bio: "Avid explorer and digital nomad.",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            wishlist: [],
            createdAt: new Date(),
        };
        this.users.push(traveler);

        // Populate sample listings
        sampleData.forEach((item, index) => {
            const reviewId = `rev_${index + 1}`;
            const listingId = `listing_${index + 1}`;

            const review = {
                _id: reviewId,
                listing: listingId,
                comment: "Absolutely breathtaking stay! The photos don't even do it justice. Exceptionally clean and wonderful host.",
                rating: 5,
                author: traveler,
                createdAt: new Date(Date.now() - (index + 2) * 24 * 60 * 60 * 1000),
            };
            this.reviews.push(review);

            const listing = {
                _id: listingId,
                ...item,
                owner: host,
                reviews: [review],
                createdAt: new Date(Date.now() - (index * 2) * 24 * 60 * 60 * 1000),
            };
            this.listings.push(listing);
        });

        // Add a sample confirmed booking
        if (this.listings.length > 0) {
            const firstListing = this.listings[0];
            const sampleBooking = {
                _id: "booking_sample_001",
                listing: firstListing,
                user: traveler,
                startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                guests: 2,
                totalPrice: firstListing.price * 3 + 1200,
                status: "confirmed",
                createdAt: new Date(),
            };
            this.bookings.push(sampleBooking);
        }

        console.log(`InMemoryStore initialized with ${this.listings.length} listings, ${this.users.length} users.`);
    }

    // === Listings ===
    findListings(filters = {}) {
        let results = [...this.listings];

        // Basic Filters
        if (filters.category && filters.category !== "All" && filters.category !== "Trending") {
            const catLower = filters.category.toLowerCase();
            results = results.filter((l) => l.category && l.category.toLowerCase() === catLower);
        }

        if (filters.search && filters.search.trim()) {
            const q = filters.search.toLowerCase().trim();
            results = results.filter(
                (l) =>
                    (l.title && l.title.toLowerCase().includes(q)) ||
                    (l.location && l.location.toLowerCase().includes(q)) ||
                    (l.country && l.country.toLowerCase().includes(q)) ||
                    (l.description && l.description.toLowerCase().includes(q))
            );
        }

        if (filters.minPrice) {
            results = results.filter((l) => l.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            results = results.filter((l) => l.price <= Number(filters.maxPrice));
        }

        // Date Availability Filter (exclude overlapping confirmed bookings)
        if (filters.checkIn && filters.checkOut) {
            const ci = new Date(filters.checkIn).getTime();
            const co = new Date(filters.checkOut).getTime();
            
            if (!isNaN(ci) && !isNaN(co)) {
                // Find all listings that have a conflicting booking
                const conflictingListingIds = new Set(
                    this.bookings
                        .filter(b => b.status === "confirmed")
                        .filter(b => {
                            const bStart = new Date(b.startDate).getTime();
                            const bEnd = new Date(b.endDate).getTime();
                            // Overlap condition: start1 < end2 && end1 > start2
                            return ci < bEnd && co > bStart;
                        })
                        .map(b => b.listing && b.listing._id ? b.listing._id.toString() : null)
                        .filter(Boolean)
                );
                
                results = results.filter(l => !conflictingListingIds.has(l._id.toString()));
            }
        }

        // Geolocation / Distance Filter
        if (filters.lat && filters.lng) {
            const userLat = parseFloat(filters.lat);
            const userLng = parseFloat(filters.lng);
            
            if (!isNaN(userLat) && !isNaN(userLng)) {
                // Haversine distance calculation in km
                const toRad = (value) => (value * Math.PI) / 180;
                results = results.map(l => {
                    let distance = Infinity;
                    if (l.geometry && l.geometry.coordinates && l.geometry.coordinates.length === 2) {
                        const [lLng, lLat] = l.geometry.coordinates;
                        const R = 6371; // km
                        const dLat = toRad(lLat - userLat);
                        const dLng = toRad(lLng - userLng);
                        const a = 
                            Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(toRad(userLat)) * Math.cos(toRad(lLat)) * 
                            Math.sin(dLng/2) * Math.sin(dLng/2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        distance = R * c;
                    }
                    return { ...l, distance };
                });
                
                // Sort by distance ascending
                results.sort((a, b) => a.distance - b.distance);
                return results; // Return early since distance sorting takes precedence if location is provided
            }
        }

        // Standard Sorting
        if (filters.sort === "price-asc") {
            results.sort((a, b) => a.price - b.price);
        } else if (filters.sort === "price-desc") {
            results.sort((a, b) => b.price - a.price);
        } else {
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return results;
    }

    getListingById(id) {
        return this.listings.find((l) => l._id.toString() === id.toString()) || null;
    }

    getHostListings(hostId) {
        return this.listings.filter(
            (l) => l.owner && l.owner._id.toString() === hostId.toString()
        );
    }

    createListing(data, ownerUser) {
        const newListing = {
            _id: `listing_${Date.now()}`,
            ...data,
            owner: ownerUser,
            reviews: [],
            createdAt: new Date(),
        };
        this.listings.unshift(newListing);
        return newListing;
    }

    updateListing(id, data) {
        const index = this.listings.findIndex((l) => l._id.toString() === id.toString());
        if (index === -1) return null;
        this.listings[index] = { ...this.listings[index], ...data };
        return this.listings[index];
    }

    deleteListing(id) {
        const index = this.listings.findIndex((l) => l._id.toString() === id.toString());
        if (index === -1) return false;
        this.listings.splice(index, 1);
        return true;
    }

    // === Reviews ===
    addReview(listingId, reviewData, authorUser) {
        const listing = this.getListingById(listingId);
        if (!listing) return null;

        const newReview = {
            _id: `rev_${Date.now()}`,
            listing: listingId,
            comment: reviewData.comment,
            rating: Number(reviewData.rating) || 5,
            author: authorUser,
            createdAt: new Date(),
        };

        this.reviews.push(newReview);
        listing.reviews = listing.reviews || [];
        listing.reviews.unshift(newReview);
        return newReview;
    }

    deleteReview(listingId, reviewId) {
        const listing = this.getListingById(listingId);
        if (listing) {
            listing.reviews = listing.reviews.filter((r) => r._id.toString() !== reviewId.toString());
        }
        this.reviews = this.reviews.filter((r) => r._id.toString() !== reviewId.toString());
        return true;
    }

    // === Users & Auth ===
    findUserByUsername(username) {
        return this.users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        ) || null;
    }

    findUserById(id) {
        return this.users.find((u) => u._id.toString() === id.toString()) || null;
    }

    registerUser({ username, email, password, isSuperhost = false, bio = "", avatar = "" }) {
        const existing = this.findUserByUsername(username);
        if (existing) throw new Error("Username already taken");

        const newUser = {
            _id: `user_${Date.now()}`,
            username,
            email,
            password,
            isSuperhost,
            bio: bio || "Passionate traveler.",
            avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            wishlist: [],
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    authenticateUser(username, password) {
        const user = this.findUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        return user;
    }

    // === Wishlist ===
    getUserWishlist(userId) {
        const user = this.findUserById(userId);
        if (!user || !user.wishlist) return [];
        return this.listings.filter((l) => user.wishlist.includes(l._id.toString()));
    }

    toggleWishlist(userId, listingId) {
        const user = this.findUserById(userId);
        if (!user) return { isSaved: false, wishlist: [] };

        user.wishlist = user.wishlist || [];
        const idStr = listingId.toString();
        const idx = user.wishlist.indexOf(idStr);

        let isSaved = false;
        if (idx > -1) {
            user.wishlist.splice(idx, 1);
            isSaved = false;
        } else {
            user.wishlist.push(idStr);
            isSaved = true;
        }

        return { isSaved, wishlist: user.wishlist };
    }

    // === Bookings ===
    getListingBookedDates(listingId) {
        return this.bookings
            .filter((b) => b.listing && b.listing._id.toString() === listingId.toString() && b.status === "confirmed")
            .map((b) => ({ startDate: b.startDate, endDate: b.endDate }));
    }

    createBooking({ listingId, userId, startDate, endDate, guests, totalPrice }) {
        const listing = this.getListingById(listingId);
        const user = this.findUserById(userId);
        if (!listing || !user) throw new Error("Listing or user not found");

        const newBooking = {
            _id: `booking_${Date.now()}`,
            listing,
            user,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            guests: Number(guests) || 1,
            totalPrice: Number(totalPrice),
            status: "confirmed",
            createdAt: new Date(),
        };

        this.bookings.unshift(newBooking);
        return newBooking;
    }

    getUserBookings(userId) {
        return this.bookings.filter(
            (b) => b.user && b.user._id.toString() === userId.toString()
        );
    }

    getHostBookings(hostId) {
        return this.bookings.filter(
            (b) =>
                b.listing &&
                b.listing.owner &&
                b.listing.owner._id.toString() === hostId.toString()
        );
    }

    cancelBooking(bookingId, userId) {
        const booking = this.bookings.find((b) => b._id.toString() === bookingId.toString());
        if (!booking) return null;
        booking.status = "cancelled";
        return booking;
    }

    // === Messages ===
    getMessagesByRoom(room) {
        return this.messages
            .filter((m) => m.room === room)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    addMessage(data) {
        const newMessage = {
            _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            room: data.room,
            sender: data.sender, // username or user object
            text: data.text,
            createdAt: new Date(),
        };
        this.messages.push(newMessage);
        return newMessage;
    }
}

const store = new InMemoryStore();
module.exports = store;

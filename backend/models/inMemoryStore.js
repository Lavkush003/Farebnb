const { data: sampleData } = require("../init/data.js");

class InMemoryStore {
  constructor() {
    this.users = [];
    this.listings = [];
    this.reviews = [];
    this.bookings = [];
    this.messages = [];

    const host = this.registerUser({ username: "wander_host", email: "host@farebnb.com", password: "host1234", isSuperhost: true, bio: "Superhost with 6+ years hosting luxury vacation properties around the world.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" });
    const traveler = this.registerUser({ username: "alex_traveler", email: "alex@farebnb.com", password: "guest1234", bio: "Avid hiker and digital nomad.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80" });

    sampleData.forEach((item, index) => {
      const listing = { _id: `listing_${index + 1}`, ...item, owner: host, reviews: [], createdAt: new Date(Date.now() - index * 86400000) };
      const review = { _id: `review_${index + 1}`, listing: listing._id, comment: "Absolutely breathtaking stay! Exceptionally clean and a wonderful host.", rating: 5, author: traveler, createdAt: new Date(Date.now() - (index + 2) * 86400000) };
      listing.reviews.push(review);
      this.listings.push(listing);
      this.reviews.push(review);
    });
  }

  findListings(filters = {}) {
    let results = [...this.listings];
    if (filters.category && filters.category !== "All") {
      results = filters.category === "Trending"
        ? results.filter((listing) => listing.isTrending)
        : results.filter((listing) => listing.category?.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search?.trim()) {
      const query = filters.search.toLowerCase().trim();
      results = results.filter((listing) => [listing.title, listing.location, listing.country, listing.description].some((value) => value?.toLowerCase().includes(query)));
    }
    if (filters.minPrice) results = results.filter((listing) => listing.price >= Number(filters.minPrice));
    if (filters.maxPrice) results = results.filter((listing) => listing.price <= Number(filters.maxPrice));
    if (filters.sort === "price-asc") results.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") results.sort((a, b) => b.price - a.price);
    return results;
  }

  getListingById(id) { return this.listings.find((listing) => listing._id === String(id)) || null; }
  getHostListings(hostId) { return this.listings.filter((listing) => listing.owner?._id === String(hostId)); }
  findUserByUsername(username) { return this.users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null; }
  findUserByEmail(email) { return this.users.find((user) => user.email === email) || null; }
  findUserByGoogleId(googleId) { return this.users.find((user) => user.googleId === googleId) || null; }
  findUserById(id) { return this.users.find((user) => user._id === String(id)) || null; }

  registerUser({ username, email, password, googleId, isSuperhost = false, bio = "", avatar = "" }) {
    if (this.findUserByUsername(username)) throw new Error("Username already taken");
    const user = { _id: `user_${Date.now()}_${this.users.length}`, username, email, password, googleId, isSuperhost, bio: bio || "Passionate traveler.", avatar, wishlist: [], createdAt: new Date() };
    this.users.push(user);
    return user;
  }
  authenticateUser(username, password) { const user = this.findUserByUsername(username); return user?.password === password ? user : null; }
  getUserWishlist(userId) { const user = this.findUserById(userId); return this.listings.filter((listing) => user?.wishlist.includes(listing._id)); }
  toggleWishlist(userId, listingId) { const user = this.findUserById(userId); if (!user) return { isSaved: false, wishlist: [] }; const id = String(listingId); const index = user.wishlist.indexOf(id); if (index >= 0) user.wishlist.splice(index, 1); else user.wishlist.push(id); return { isSaved: index < 0, wishlist: user.wishlist }; }

  createListing(data, owner) { const listing = { _id: `listing_${Date.now()}`, ...data, owner, reviews: [], createdAt: new Date() }; this.listings.unshift(listing); return listing; }
  updateListing(id, data) { const listing = this.getListingById(id); if (!listing) return null; Object.assign(listing, data); return listing; }
  deleteListing(id) { const index = this.listings.findIndex((listing) => listing._id === String(id)); if (index < 0) return false; this.listings.splice(index, 1); return true; }
  addReview(listingId, reviewData, author) { const listing = this.getListingById(listingId); if (!listing) return null; const review = { _id: `review_${Date.now()}`, listing: listingId, ...reviewData, rating: Number(reviewData.rating) || 5, author, createdAt: new Date() }; listing.reviews.unshift(review); this.reviews.push(review); return review; }
  deleteReview(listingId, reviewId) { const listing = this.getListingById(listingId); if (listing) listing.reviews = listing.reviews.filter((review) => review._id !== String(reviewId)); this.reviews = this.reviews.filter((review) => review._id !== String(reviewId)); }

  createBooking({ listingId, userId, startDate, endDate, guests, totalPrice, paymentMethod }) { const listing = this.getListingById(listingId); const user = this.findUserById(userId); if (!listing || !user) throw new Error("Listing or user not found"); const booking = { _id: `booking_${Date.now()}`, listing, user, startDate: new Date(startDate), endDate: new Date(endDate), guests: Number(guests) || 1, totalPrice: Number(totalPrice), paymentMethod, paymentStatus: "pending", status: "confirmed", createdAt: new Date() }; this.bookings.unshift(booking); return booking; }
  getListingBookedDates(listingId) { return this.bookings.filter((booking) => booking.listing?._id === String(listingId) && booking.status === "confirmed").map(({ startDate, endDate }) => ({ startDate, endDate })); }
  getUserBookings(userId) { return this.bookings.filter((booking) => booking.user?._id === String(userId)); }
  getHostBookings(hostId) { return this.bookings.filter((booking) => booking.listing?.owner?._id === String(hostId)); }
  cancelBooking(id) { const booking = this.bookings.find((item) => item._id === String(id)); if (booking) booking.status = "cancelled"; return booking; }
  getMessagesByRoom(room) { return this.messages.filter((message) => message.room === room).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); }
  addMessage(data) { const message = { _id: `message_${Date.now()}`, ...data, createdAt: new Date() }; this.messages.push(message); return message; }
}

module.exports = new InMemoryStore();

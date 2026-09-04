const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../../utils/wrapAsync.js");
const Listing = require("../../models/listing.js");
const inMemoryStore = require("../../models/inMemoryStore.js");
const multer = require("multer");

let upload;
try {
  const { storage } = require("../../cloudConfig.js");
  upload = multer({ storage });
} catch (e) {
  upload = multer({ dest: "uploads/" });
}

const removeDuplicateImages = (listings) => {
  const seenImages = new Set();
  return listings.filter((listing) => {
    const imageUrl = listing.image?.url;
    if (!imageUrl) return true;

    const imageKey = imageUrl;
    if (seenImages.has(imageKey)) return false;
    seenImages.add(imageKey);
    return true;
  });
};

// Check logged in
const isLoggedInApi = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

// GET /api/listings/host/my-listings
router.get(
  "/host/my-listings",
  isLoggedInApi,
  wrapAsync(async (req, res) => {
    if (mongoose.connection.readyState === 1) {
      const myListings = await Listing.find({ owner: req.user._id })
        .populate("reviews")
        .sort({ createdAt: -1 });
      return res.json(myListings);
    }
    const listings = inMemoryStore.getHostListings(req.user._id);
    res.json(listings);
  })
);

// GET /api/listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    if (mongoose.connection.readyState === 1) {
      const { category, search, minPrice, maxPrice, sort, checkIn, checkOut, lat, lng } = req.query;
      let query = {};

      if (category && category !== "All") {
        if (category === "Trending") {
          query.isTrending = true;
        } else {
          query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }
      }

      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [
          { title: searchRegex },
          { location: searchRegex },
          { country: searchRegex },
          { description: searchRegex },
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // CheckIn / CheckOut Date filtering
      if (checkIn && checkOut) {
          const ci = new Date(checkIn);
          const co = new Date(checkOut);
          if (!isNaN(ci.getTime()) && !isNaN(co.getTime())) {
              const Booking = require("../../models/booking.js");
              const overlappingBookings = await Booking.find({
                  status: "confirmed",
                  startDate: { $lt: co },
                  endDate: { $gt: ci }
              });
              const bookedListingIds = overlappingBookings.map(b => b.listing);
              query._id = { $nin: bookedListingIds };
          }
      }

      // Geolocation Near filtering
      if (lat && lng) {
          const userLat = parseFloat(lat);
          const userLng = parseFloat(lng);
          if (!isNaN(userLat) && !isNaN(userLng)) {
              query.geometry = {
                  $near: {
                      $geometry: {
                          type: "Point",
                          coordinates: [userLng, userLat]
                      }
                  }
              };
          }
      }

      let queryBuilder = Listing.find(query)
        .populate("owner", "username avatar isSuperhost")
        .populate("reviews");

      // Note: $near automatically sorts by distance, so we only apply other sorts if lat/lng are missing
      if (!lat || !lng) {
          if (sort === "price-asc") {
            queryBuilder = queryBuilder.sort({ price: 1 });
          } else if (sort === "price-desc") {
            queryBuilder = queryBuilder.sort({ price: -1 });
          } else {
            queryBuilder = queryBuilder.sort({ createdAt: -1 });
          }
      }

      const listings = await queryBuilder.exec();
      return res.json(removeDuplicateImages(listings));
    }

    const listings = inMemoryStore.findListings(req.query);
    res.json(removeDuplicateImages(listings));
  })
);

// GET /api/listings/:id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const listing = await Listing.findById(id)
        .populate({
          path: "reviews",
          populate: { path: "author", select: "username avatar" },
        })
        .populate("owner", "username email avatar isSuperhost bio");

      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      return res.json(listing);
    }

    const listing = inMemoryStore.getListingById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  })
);

const parseAmenities = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return raw.split(",").map((a) => a.trim()).filter(Boolean);
};

// POST /api/listings
router.post(
  "/",
  isLoggedInApi,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const listingData = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      location: req.body.location,
      country: req.body.country,
      category: req.body.category || "Trending",
      amenities: parseAmenities(req.body.amenities),
      bedrooms: Number(req.body.bedrooms) || 1,
      beds: Number(req.body.beds) || 1,
      bathrooms: Number(req.body.bathrooms) || 1,
      maxGuests: Number(req.body.maxGuests) || 2,
    };

    let image = {
      url: req.body.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      filename: "listing_img",
    };
    if (req.file) {
      image = { url: req.file.path, filename: req.file.filename };
    }

    const geometry = {
      type: "Point",
      coordinates: [-118.2437, 34.0522],
    };

    if (mongoose.connection.readyState === 1) {
      const newListing = new Listing({
        ...listingData,
        image,
        geometry,
        owner: req.user._id,
      });
      const savedListing = await newListing.save();
      return res.status(201).json(savedListing);
    }

    const created = inMemoryStore.createListing(
      { ...listingData, image, geometry },
      req.user
    );
    res.status(201).json(created);
  })
);

// PUT /api/listings/:id
router.put(
  "/:id",
  isLoggedInApi,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingData = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      location: req.body.location,
      country: req.body.country,
      category: req.body.category,
      amenities: parseAmenities(req.body.amenities),
      bedrooms: Number(req.body.bedrooms) || 1,
      beds: Number(req.body.beds) || 1,
      bathrooms: Number(req.body.bathrooms) || 1,
      maxGuests: Number(req.body.maxGuests) || 2,
    };

    if (req.file) {
      listingData.image = { url: req.file.path, filename: req.file.filename };
    } else if (req.body.imageUrl) {
      listingData.image = { url: req.body.imageUrl, filename: "listing_img" };
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await Listing.findByIdAndUpdate(id, listingData, { new: true });
      return res.json(updated);
    }

    const updated = inMemoryStore.updateListing(id, listingData);
    res.json(updated);
  })
);

// DELETE /api/listings/:id
router.delete(
  "/:id",
  isLoggedInApi,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Listing.findByIdAndDelete(id);
      return res.json({ message: "Listing deleted successfully" });
    }
    inMemoryStore.deleteListing(id);
    res.json({ message: "Listing deleted successfully" });
  })
);

module.exports = router;

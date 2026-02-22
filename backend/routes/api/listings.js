const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const Listing = require("../../models/listing.js");
const { listingSchema } = require("../../schema.js");
const ExpressError = require("../../utils/ExpressError.js");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Middleware: check if logged in (API version - returns JSON)
const isLoggedInApi = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

// Middleware: check if owner (API version)
const isOwnerApi = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  if (!listing.owner.equals(req.user._id)) {
    return res.status(403).json({ error: "You are not the owner of this listing" });
  }
  next();
};

// Validate listing body
const validateListingApi = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ error: errMsg });
  }
  next();
};

// GET /api/listings - Get all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
  })
);

// GET /api/listings/:id - Get single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  })
);

// POST /api/listings - Create a new listing
router.post(
  "/",
  isLoggedInApi,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    // Build listing object from form data
    const listingData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
    };

    // Validate with Joi
    const { error } = listingSchema.validate({ listing: listingData });
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      return res.status(400).json({ error: errMsg });
    }

    // Geocode
    const response = await geocodingClient
      .forwardGeocode({ query: listingData.location, limit: 1 })
      .send();

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    if (response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    }

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  })
);

// PUT /api/listings/:id - Update a listing
router.put(
  "/:id",
  isLoggedInApi,
  isOwnerApi,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listingData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
    };

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
    }

    res.json(listing);
  })
);

// DELETE /api/listings/:id - Delete a listing
router.delete(
  "/:id",
  isLoggedInApi,
  isOwnerApi,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted successfully" });
  })
);

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Trending",
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  amenities: {
    type: [String],
    default: ["Wifi", "Kitchen", "Air conditioning", "Free parking"],
  },
  bedrooms: {
    type: Number,
    default: 1,
    min: 1,
  },
  beds: {
    type: Number,
    default: 1,
    min: 1,
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: 0.5,
  },
  maxGuests: {
    type: Number,
    default: 2,
    min: 1,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
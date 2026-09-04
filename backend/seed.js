if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require('path').join(__dirname, '.env') });
}

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");
const Review = require("./models/review");
const { data } = require("./init/data");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/farebnb";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to DB for seeding");
  } catch (error) {
    console.error("Could not connect to MongoDB. Seeding was not completed.");
    console.error("Check your Atlas IP allowlist, credentials, cluster status, or local MongoDB service.");
    throw error;
  }
};

const initDB = async () => {
  // Ensure a default host user exists
  let hostUser = await User.findOne({ username: "wander_host" });
  if (!hostUser) {
    const newHost = new User({
      username: "wander_host",
      email: "host@farebnb.com",
      isSuperhost: true,
      bio: "Superhost with 6+ years hosting luxury vacation properties around the globe.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });
    hostUser = await User.register(newHost, "host1234");
  }

  // Ensure a reviewer user exists
  let reviewerUser = await User.findOne({ username: "alex_traveler" });
  if (!reviewerUser) {
    const newReviewer = new User({
      username: "alex_traveler",
      email: "alex@farebnb.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      bio: "Avid hiker and digital nomad.",
    });
    reviewerUser = await User.register(newReviewer, "guest1234");
  }

  await Listing.deleteMany({});
  await Review.deleteMany({});

  for (const item of data) {
    // Create sample reviews for each listing
    const review1 = new Review({
      comment: "Absolutely breathtaking stay! The photos don't even do it justice. Exceptionally clean and wonderful hosts.",
      rating: 5,
      author: reviewerUser._id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });
    await review1.save();

    const newListing = new Listing({
      ...item,
      owner: hostUser._id,
      reviews: [review1._id],
    });

    await newListing.save();
  }

  console.log(`Database Seeded Successfully with ${data.length} rich listings!`);
};

connectToDatabase()
  .then(() => initDB())
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Seed error:", err);
    mongoose.connection.close();
  });
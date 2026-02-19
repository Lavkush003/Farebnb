
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { data } = require("./data");

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
  console.log("Database Seeded Successfully");
};

initDB().then(() => {
  mongoose.connection.close();
});

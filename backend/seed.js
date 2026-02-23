
// // if (process.env.NODE_ENV !== "production") {
// //   require("dotenv").config();
// // }

// // const mongoose = require("mongoose");
// // const Listing = require("./models/listing");
// // const data = require("../init/data");

// // const dbUrl = process.env.ATLASDB_URL;

// // mongoose.connect(dbUrl)
// //   .then(() => console.log("Connected to DB"))
// //   .catch(err => console.log(err));

// // const initDB = async () => {
// //   await Listing.deleteMany({});
// //   await Listing.insertMany(data);
// //   console.log("Database Seeded Successfully");
// // };

// // initDB().then(() => {
// //   mongoose.connection.close();
// // });





// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const mongoose = require("mongoose");
// const Listing = require("./models/listing");
// const data = require("./init/data");

// const dbUrl = process.env.ATLASDB_URL;

// mongoose.connect(dbUrl)
//   .then(() => console.log("Connected to DB"))
//   .catch(err => console.log(err));

// const initDB = async () => {
//   await Listing.deleteMany({});
//   await Listing.insertMany(data);
//   console.log("Database Seeded Successfully");
// };

// initDB().then(() => {
//   mongoose.connection.close();
// });



if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require('path').join(__dirname, '.env') });
}

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { data } = require("./init/data");   // ✅ FIXED PATH

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  const enrichedData = data.map((obj) => ({
    ...obj,
    owner: "69901490e5b391a245580ae9",
    geometry: {
      type: "Point",
      coordinates: [-118.2437, 34.0522],
    },
  }));
  await Listing.insertMany(enrichedData);
  console.log("Database Seeded Successfully");
};

initDB().then(() => {
  mongoose.connection.close();
});
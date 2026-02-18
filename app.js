
if(process.env.NODE_ENV != "production"){
require('dotenv').config();

}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const reviews = require("./models/review.js"); // ✅ Added
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const { listingSchema, reviewSchema } = require("./schema.js");
const reviewRouter=require("./routes/reviews.js");
const listingRouter = require("./routes/listing.js");
const userRouter =require("./routes/user.js");

// ======================
// Connecting to Database
// ======================


const dbUrl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// ======================
// App Configuration
// ======================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,


});

store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
    httpOnly: true,


  },

};

// app.get("/", (req, res) => {
//   res.send("hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  
  next();
});

// app.get("/demoUser", async(req, res)=>{
// let fakeUser=new User({
//   email: "student@gmail.com",
//   username: "delta-student",
// });

// let registeredUser = await User.register(fakeUser, "helloworld");
// res.send(registeredUser);

// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);




// ======================
// Root Route
// ======================


// ======================
// Validation Middlewares
// ======================

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ======================
// Listing Routes
// ======================

// app.use("/listings", listings);

// ======================
// Review Routes
// ======================

// Create Review
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

// ======================
// Error Handling
// ======================

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ======================
// Server Start
// ======================

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

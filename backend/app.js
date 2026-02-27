
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").join(__dirname, ".env") });
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js"); // ✅ FIXED
const User = require("./models/user.js");

const { listingSchema, reviewSchema } = require("./schema.js");

const reviewRouter = require("./routes/reviews.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const apiListingRouter = require("./routes/api/listings.js");
const apiReviewRouter = require("./routes/api/reviews.js");
const apiUserRouter = require("./routes/api/users.js");
const apiBookingRouter = require("./routes/api/bookings.js");

const app = express();

/* ======================
   DATABASE CONNECTION
====================== */

const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

/* ======================
   BASIC CONFIG
====================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* ======================
   CORS CONFIG
====================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://farebnb.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

/* ======================
   SESSION CONFIG
====================== */

app.set("trust proxy", 1); // ✅ REQUIRED for Render

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // required for production
    sameSite: "none", // required for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

/* ======================
   PASSPORT CONFIG
====================== */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        user = new User({
          googleId: profile.id,
          username:
            profile.displayName.replace(/\s+/g, "").toLowerCase() +
            Math.floor(Math.random() * 1000),
          email: profile.emails[0].value,
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* ======================
   ROUTES
====================== */

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use("/api/listings", apiListingRouter);
app.use("/api/listings/:id/reviews", apiReviewRouter);
app.use("/api/users", apiUserRouter);
app.use("/api/bookings", apiBookingRouter);

/* ======================
   VALIDATION
====================== */

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

/* ======================
   ERROR HANDLING
====================== */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

/* ======================
   SERVER START
====================== */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
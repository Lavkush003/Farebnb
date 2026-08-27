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
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const http = require("http");
const { Server } = require("socket.io");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const inMemoryStore = require("./models/inMemoryStore.js");

const reviewRouter = require("./routes/reviews.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const apiListingRouter = require("./routes/api/listings.js");
const apiReviewRouter = require("./routes/api/reviews.js");
const apiUserRouter = require("./routes/api/users.js");
const apiBookingRouter = require("./routes/api/bookings.js");
const apiWishlistRouter = require("./routes/api/wishlist.js");
const apiHostRouter = require("./routes/api/host.js");
const apiAiRouter = require("./routes/api/ai.js");

const app = express();

/* ======================
   DATABASE CONNECTION
====================== */

const dbUrl = process.env.ATLASDB_URL || "";

if (dbUrl && !dbUrl.includes("<db_username>")) {
  mongoose
    .connect(dbUrl, { serverSelectionTimeoutMS: 4000 })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) =>
      console.log("Atlas connection failed, using in-memory store:", err.message)
    );
} else {
  console.log(
    "No Atlas credentials provided. Running in high-performance in-memory mode."
  );
}

// Prevent unhandled promise rejections from crashing the server
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Prevent uncaught exceptions from crashing the server
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

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

const isProduction = process.env.NODE_ENV === "production";
const allowedFrontendOrigins = (
  process.env.FRONTEND_URL ||
  (isProduction ? "https://farebnb-three.vercel.app" : "http://localhost:5173")
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedFrontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by Farebnb CORS policy"));
    },
    credentials: true,
  })
);

/* ======================
   SESSION CONFIG
====================== */

app.set("trust proxy", 1);

const sessionOptions = {
  secret: process.env.SECRET || "farebnbsecretkey123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
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

passport.use(new LocalStrategy(User.authenticate ? User.authenticate() : () => {}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(id);
      return done(null, user);
    }
    const user = inMemoryStore.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* ======================
   ROUTES
====================== */

// EJS legacy routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// REST API routes
app.use("/api/listings", apiListingRouter);
app.use("/api/listings/:id/reviews", apiReviewRouter);
app.use("/api/users", apiUserRouter);
app.use("/api/bookings", apiBookingRouter);
app.use("/api/wishlist", apiWishlistRouter);
app.use("/api/host", apiHostRouter);
app.use("/api/ai", apiAiRouter);

// Messaging API
app.get("/api/messages/:room", (req, res) => {
  const { room } = req.params;
  const messages = inMemoryStore.getMessagesByRoom(room);
  res.json(messages);
});

/* ======================
   ERROR HANDLING
====================== */

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "Endpoint Not Found" });
  }
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({ error: message });
  }
  res.status(statusCode).render("error.ejs", { message });
});

/* ======================
   SERVER START (Socket.io + Express)
====================== */

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedFrontendOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (data) => {
    // data: { room, sender, text }
    const savedMsg = inMemoryStore.addMessage(data);
    io.to(data.room).emit("receive_message", savedMsg);
  });
});

server.listen(PORT, () => {
  console.log(`Farebnb Backend & WebSocket Server running on port ${PORT}`);
});
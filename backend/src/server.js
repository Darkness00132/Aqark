const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
// const cookieParser = require("cookie-parser");
const helmet = require("helmet");
// const tokens = require("./utils/csrfTokens.js");
// const rateLimit = require("express-rate-limit");
const xss = require("xss");
require("dotenv").config();

const googleRouter = require("./routes/google.route");
const userRouter = require("./routes/user.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sanitizeNoMongo = (input) => {
  if (typeof input === "string") {
    return xss(input);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = Array.isArray(input) ? [] : {};
    for (const key in input) {
      if (key.startsWith("$") || key.includes(".")) continue;
      sanitized[key] = sanitizeNoMongo(input[key]);
    }
    return sanitized;
  }
  return input;
};

app.use((req, res, next) => {
  req.body = sanitizeNoMongo(req.body);
  req.query = sanitizeNoMongo(req.query);
  req.params = sanitizeNoMongo(req.params);
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }));
app.use(
  helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true })
);
// app.set("trust proxy", 1);
// app.use(
//   rateLimit({
//     windowMs: 60 * 1000,
//     max: 30,
//     message: "Too many requests, please try again later.",
//     standardHeaders: true,
//     legacyHeaders: false,
//   })
// );
app.disable("x-powered-by");

// MongoDB connection
connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Route to fetch CSRF secret + token
// app.get("/api/csrf-token", (req, res) => {
//   const secret = tokens.secretSync();
//   const token = tokens.create(secret);
//   res.cookie("csrf-secret", secret, {
//     httpOnly: true,
//     sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
//     secure: process.env.PRODUCTION === "true",
//   });
//   res.json({ csrfToken: token });
// });

app.use("/api/users", userRouter);
app.use(googleRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Error: ", err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000 || err.code === "E11000") {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: `Duplicate value for field '${field}': '${value}'`,
      field,
      value,
    });
  }

  // Cast Error (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid value for '${err.path}': ${err.value}`,
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Token expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token has expired" });
  }

  // Fallback Error
  return res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

module.exports = app;
// app.listen(PORT);

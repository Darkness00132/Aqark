import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";
import helmet from "helmet";
import xss from "xss";

import googleRouter from "./routes/google.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize input to prevent Mongo Injection
const sanitizeNoMongo = (input: any): any => {
  if (typeof input === "string") return xss(input);
  if (typeof input === "object" && input !== null) {
    const sanitized: any = Array.isArray(input) ? [] : {};
    for (const key in input) {
      if (key.startsWith("$") || key.includes(".")) continue;
      sanitized[key] = sanitizeNoMongo(input[key]);
    }
    return sanitized;
  }
  return input;
};

app.use((req, _res, next) => {
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
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }));
app.use(
  helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true })
);
app.disable("x-powered-by");

// MongoDB connection
connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRouter);
app.use(googleRouter);

// Global Error Handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error: ", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err.code === 11000 || err.code === "E11000") {
    const field = Object.keys(err.keyValue)[0];
    let value;
    if (field) {
      value = err.keyValue?.[field];
    }
    return res.status(409).json({
      message: `Duplicate value for field '${field}': '${value}'`,
      field,
      value,
    });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ message: `Invalid value for '${err.path}': ${err.value}` });
  }

  if (err.name === "JsonWebTokenError")
    return res.status(401).json({ message: "Invalid token" });
  if (err.name === "TokenExpiredError")
    return res.status(401).json({ message: "Token has expired" });

  return res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong" });
});

// export default app;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

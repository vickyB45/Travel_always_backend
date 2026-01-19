import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./config/db.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
// routes
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import packageRoutes from "./routes/package.routes.js";
import categoryRoute from "./routes/category.routes.js";

// env load
dotenv.config();

// db connect
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", apiLimiter);


// cors (frontend se cookie allow karne ke liye)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);

// base route
app.get("/", (req, res) => {
  res.json({ message: "Travel API running 🚀" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/category", categoryRoute);

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

import rateLimit from "express-rate-limit";

// 🔐 strict for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 requests
  message: {
    message: "Too many login attempts. Try again later.",
  },
});

// 🌐 normal APIs
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

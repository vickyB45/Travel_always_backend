import jwt from "jsonwebtoken";

const generateToken = (res, adminId = "admin") => {
  const token = jwt.sign(
    { adminId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("travelAdminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export default generateToken;

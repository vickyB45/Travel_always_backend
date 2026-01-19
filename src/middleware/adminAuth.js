import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.travelAdminToken;

    if (!token) {
      return res.status(401).json({
        message: "Admin not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin session",
    });
  }
};

export default adminAuth;

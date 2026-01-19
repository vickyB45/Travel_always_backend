import generateToken from "../utils/generateToken.js";

/**
 * @desc    Admin Login (ENV based)
 * @route   POST /api/auth/login
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    // 🔥 util use ho raha hai
    generateToken(res);

    return res.status(200).json({
      message: "Admin login successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Admin login failed",
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/auth/logout
 */
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("travelAdminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Admin logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

/**
 * @desc    Get admin session
 * @route   GET /api/auth/me
 */
export const adminMe = async (req, res) => {
  try {
    // middleware check fail hua to yaha aayega hi nahi
    if (!req.adminId) {
      return res.status(401).json({
        isAuthenticated: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      isAuthenticated: true,
      role: "admin",
      email:process.env.ADMIN_EMAIL
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify admin session",
    });
  }
};


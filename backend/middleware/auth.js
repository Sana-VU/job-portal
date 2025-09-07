const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret-key"
    );

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;

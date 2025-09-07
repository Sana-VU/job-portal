const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin login to get JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  // Validate against environment variables (or database in production)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jobportal.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    // Create JWT token
    const token = jwt.sign(
      {
        user: {
          id: "admin-id",
          email: adminEmail,
          role: "admin",
        },
      },
      process.env.JWT_SECRET || "jwt-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

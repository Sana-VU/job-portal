const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("../cloudinary");
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint for monitoring
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // MongoDB connection status
    const mongoStatus = {
      status: "unknown",
      connected: false,
      latency: null,
    };

    const dbConnectionStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    mongoStatus.status =
      dbConnectionStates[mongoose.connection.readyState] || "unknown";
    mongoStatus.connected = mongoose.connection.readyState === 1;

    // Measure MongoDB latency
    if (mongoStatus.connected) {
      const startTime = Date.now();
      await mongoose.connection.db.admin().ping();
      mongoStatus.latency = Date.now() - startTime;
    }

    // Cloudinary connection status
    let cloudinaryStatus = {
      configured: false,
      status: "unconfigured",
      error: null,
    };

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinaryStatus.configured = true;

      try {
        // Simple Cloudinary ping
        const startTime = Date.now();
        await cloudinary.api.ping();
        cloudinaryStatus.status = "connected";
        cloudinaryStatus.latency = Date.now() - startTime;
      } catch (err) {
        cloudinaryStatus.status = "error";
        cloudinaryStatus.error =
          process.env.NODE_ENV === "development"
            ? err.message
            : "Connection error";
      }
    }

    // System health information
    const systemInfo = {
      uptime: Math.round(process.uptime()),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      pid: process.pid,
      node_version: process.version,
      env: process.env.NODE_ENV || "development",
    };

    res.json({
      status:
        mongoStatus.connected &&
        (cloudinaryStatus.configured
          ? cloudinaryStatus.status === "connected"
          : true)
          ? "healthy"
          : "degraded",
      services: {
        mongodb: mongoStatus,
        cloudinary: cloudinaryStatus,
      },
      system: systemInfo,
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({
      status: "error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
});

module.exports = router;

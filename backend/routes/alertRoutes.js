const express = require("express");
const router = express.Router();

// Optional nodemailer import - only use if available
let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  console.warn("Nodemailer not available - email alerts disabled");
}

// Setup nodemailer transporter (only if nodemailer is available)
let transporter;
if (nodemailer) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Middleware to check admin authentication
const adminAuth = (req, res, next) => {
  // This is a simplified check - in a real application, use proper authentication
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

// Set up alert configuration
router.post("/alerts/config", adminAuth, async (req, res) => {
  try {
    const { emails, thresholds } = req.body;

    if (!emails || !Array.isArray(emails) || !emails.length) {
      return res
        .status(400)
        .json({ message: "Valid email addresses are required" });
    }

    // Store alert configuration in database or environment variables
    // This is a simplified example - in a real app, you'd store this in a database
    process.env.ALERT_EMAILS = emails.join(",");

    if (thresholds) {
      process.env.MEMORY_THRESHOLD = thresholds.memory || "85";
      process.env.CPU_THRESHOLD = thresholds.cpu || "90";
      process.env.RESPONSE_TIME_THRESHOLD = thresholds.responseTime || "1000";
    }

    res
      .status(200)
      .json({ message: "Alert configuration updated successfully" });
  } catch (error) {
    console.error("Error updating alert configuration:", error);
    res.status(500).json({ message: "Failed to update alert configuration" });
  }
});

// Send test alert
router.post("/alerts/test", adminAuth, async (req, res) => {
  try {
    if (!nodemailer || !transporter) {
      return res.status(503).json({ message: "Email service not configured" });
    }

    const alertEmails = process.env.ALERT_EMAILS?.split(",") || [];

    if (!alertEmails.length) {
      return res.status(400).json({ message: "No alert emails configured" });
    }

    const testMailOptions = {
      from: process.env.EMAIL_FROM,
      to: alertEmails.join(","),
      subject: "Job Portal - Test Alert",
      html: `
        <h2>Test Alert from Job Portal Monitoring System</h2>
        <p>This is a test alert to verify your notification system is working correctly.</p>
        <p>If you received this email, your alert configuration is working properly.</p>
        <hr>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    };

    await transporter.sendMail(testMailOptions);

    res.status(200).json({ message: "Test alert sent successfully" });
  } catch (error) {
    console.error("Error sending test alert:", error);
    res.status(500).json({ message: "Failed to send test alert" });
  }
});

// Get alert history
router.get("/alerts/history", adminAuth, async (req, res) => {
  try {
    // In a real application, you would fetch this from a database
    // This is a simplified example that returns mock data
    const mockAlertHistory = [
      {
        id: "alert-001",
        type: "memory",
        message: "Memory usage exceeded threshold (85%)",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolved: true,
        resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "alert-002",
        type: "database",
        message: "Database connection failure",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        resolved: true,
        resolvedAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "alert-003",
        type: "api",
        message: "API response time exceeded threshold (1000ms)",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        resolvedAt: null,
      },
    ];

    res.status(200).json(mockAlertHistory);
  } catch (error) {
    console.error("Error fetching alert history:", error);
    res.status(500).json({ message: "Failed to fetch alert history" });
  }
});

module.exports = router;

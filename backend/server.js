const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");
let MongoMemoryServer;
try {
  MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
} catch (_) {
  MongoMemoryServer = null;
}

// Load environment variables
dotenv.config();

// Read package.json for version info
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
);

// Import routes
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const healthRoutes = require("./routes/healthRoutes");
const alertRoutes = require("./routes/alertRoutes");

// Initialize Express app
const app = express();

// Initialize Sentry (before all middleware) - only if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0, // Adjust in production
    environment: process.env.NODE_ENV || "development",
    release: process.env.COMMIT_SHA || "dev",
    enabled: true,
  });
}

// Sentry request handler must be the first middleware (only if Sentry is initialized)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
  // Sentry tracing middleware
  app.use(Sentry.Handlers.tracingHandler());
}

// Other middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Enhanced security with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration from environment
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "*").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // Limit each IP to 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again after 1 minute",
  },
});

// Apply rate limiting to all routes
app.use("/api/", apiLimiter);

// Logging
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Legacy health endpoint - redirects to new health endpoint
app.get("/api/health-legacy", async (_req, res) => {
  const map = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({
    status: "ok",
    db: map[mongoose.connection.readyState] ?? "unknown",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    uptime: Math.round(process.uptime()),
  });
});

// Version endpoint
app.get("/api/version", (_req, res) => {
  // Try to get the commit SHA from the environment variable (set during deployment)
  // or from the Git repository if available
  let commitSHA = process.env.GIT_COMMIT_SHA || "unknown";

  try {
    // Try to get the commit SHA from git if it's available
    // This is a simple approach - in production environments, the SHA
    // should be injected during the build process
    if (
      commitSHA === "unknown" &&
      fs.existsSync(path.join(__dirname, ".git"))
    ) {
      const gitHeadPath = path.join(__dirname, ".git", "HEAD");
      if (fs.existsSync(gitHeadPath)) {
        const headContent = fs.readFileSync(gitHeadPath, "utf8").trim();
        const isDetached = !headContent.startsWith("ref:");

        if (isDetached) {
          commitSHA = headContent;
        } else {
          const refPath = headContent.substring(5);
          const gitHeadRef = path.join(__dirname, ".git", refPath);
          if (fs.existsSync(gitHeadRef)) {
            commitSHA = fs.readFileSync(gitHeadRef, "utf8").trim();
          }
        }
      }
    }
  } catch (error) {
    console.error("Error getting commit SHA:", error);
  }

  res.json({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    node: process.version,
    commit: commitSHA,
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/monitoring", alertRoutes);

// Sentry error handler must come before other error middleware (only if Sentry is initialized)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware
app.use((err, req, res, next) => {
  // Capture the error in Sentry if it's not already captured and Sentry is available
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const start = async () => {
  const port = process.env.PORT || 5000;
  try {
    mongoose.set("strictQuery", true);
    let mongoUri = process.env.MONGO_URI;
    const useMemory =
      process.env.USE_IN_MEMORY_DB === "true" || !mongoUri || mongoUri === "";
    if (useMemory) {
      if (!MongoMemoryServer) {
        throw new Error(
          "mongodb-memory-server not available. Set MONGO_URI or install devDependencies."
        );
      }
      const mem = await MongoMemoryServer.create();
      mongoUri = mem.getUri();
      console.log("⚙️  Using in-memory MongoDB for development");
    }
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB || "job-portal",
    });
    console.log("✅ MongoDB connected");
    app.listen(port, () => console.log(`✅ API listening on :${port}`));
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

start();
module.exports = app;

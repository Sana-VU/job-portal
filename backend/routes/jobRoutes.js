const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Job = require("../models/jobModel");

// Input validation middleware
const validateJobInput = [
  body("title").notEmpty().withMessage("Job title is required"),
  body("organization").notEmpty().withMessage("Organization is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "IT & Software",
      "Banking & Finance",
      "Healthcare",
      "Education",
      "Engineering",
      "Government",
      "Sales & Marketing",
      "Customer Service",
      "Administrative",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("location").notEmpty().withMessage("Location is required"),
  body("source").notEmpty().withMessage("Source is required"),
  body("publishDate").isISO8601().withMessage("Valid publish date is required"),
  body("lastDate").isISO8601().withMessage("Valid last date is required"),
  body("adImage").notEmpty().withMessage("Advertisement image is required"),
];

// Validation result middleware
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/jobs - Create a new job
router.post("/", validateJobInput, checkValidationResult, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/jobs - Get all jobs with filtering
router.get("/", async (req, res) => {
  try {
    const {
      keyword,
      category,
      location,
      source,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (keyword) {
      filter.$text = { $search: keyword };
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (source) {
      filter.source = { $regex: source, $options: "i" };
    }

    // Only show active jobs
    filter.isActive = true;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      count: jobs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/jobs/:id - Get a single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT /api/jobs/:id - Update a job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE /api/jobs/:id - Delete a job
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

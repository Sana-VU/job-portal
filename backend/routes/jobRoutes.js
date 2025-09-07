const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// GET all jobs (public route)
router.get("/", async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      location,
      source,
      page = 1,
      limit = 10,
    } = req.query;
    const q = {};
    if (keyword) q.$text = { $search: String(keyword) };
    if (category) q.category = category;
    if (location) q.location = location;
    if (source) q.source = source;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Job.find(q).sort({ publishDate: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(q),
    ]);

    res.json({ items, page: Number(page), limit: Number(limit), total });
  } catch (e) {
    next(e);
  }
});

// GET job by ID (public route)
router.get("/:id", async (req, res, next) => {
  try {
    const one = await Job.findById(req.params.id);
    if (!one) return res.status(404).json({ message: "Not found" });

    // Increment view count
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(one);
  } catch (e) {
    next(e);
  }
});

// POST create new job (protected route - admin only)
router.post(
  "/",
  auth,
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Title is required"),
    body("organization")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Organization is required"),
    body("publishDate").isISO8601().toDate().withMessage("Invalid publishDate"),
    body("lastDate").isISO8601().toDate().withMessage("Invalid lastDate"),
    body("category").optional().trim().escape(),
    body("location").optional().trim().escape(),
    body("source").optional().trim().escape(),
    body("description").optional().trim(),
    body("imageUrl").optional().isURL().withMessage("imageUrl must be a URL"),
  ],
  async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const {
      title,
      organization,
      category,
      location,
      publishDate,
      lastDate,
      source,
      imageUrl,
      description,
      salaryMin,
      salaryMax,
      employmentType,
      applyUrl,
      requirements,
      benefits,
      experience,
      education,
      skills,
      tags,
      status,
    } = req.body;

    // Validation
    if (!title || !organization || !publishDate || !lastDate) {
      return res.status(400).json({
        message:
          "Missing required fields: title, organization, publishDate, lastDate",
      });
    }

    const newJob = new Job({
      title,
      organization,
      category,
      location,
      publishDate,
      lastDate,
      source,
      imageUrl,
      description,
      salaryMin,
      salaryMax,
      employmentType,
      applyUrl,
      requirements,
      benefits,
      experience,
      education,
      skills,
      tags,
      status: status || "active",
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (e) {
    next(e);
  }
}
);

// PUT update job by ID (protected route - admin only)
router.put(
  "/:id",
  auth,
  [
    body("publishDate").optional().isISO8601().toDate(),
    body("lastDate").optional().isISO8601().toDate(),
    body("imageUrl").optional().isURL(),
  ],
  async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const jobId = req.params.id;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob);
  } catch (e) {
    next(e);
  }
}
);

// DELETE job by ID (protected route - admin only)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (e) {
    next(e);
  }
});

// GET job statistics (public route)
router.get("/stats/overview", async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalApplications: { $sum: "$applications" },
          avgViews: { $avg: "$views" },
          avgApplications: { $avg: "$applications" },
        },
      },
    ]);

    const categoryStats = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const locationStats = await Job.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const recentJobs = await Job.find({ status: "active" })
      .sort({ publishDate: -1 })
      .limit(5)
      .select("title organization location publishDate views");

    res.json({
      overview: stats[0] || {
        totalJobs: 0,
        totalViews: 0,
        totalApplications: 0,
        avgViews: 0,
        avgApplications: 0,
      },
      topCategories: categoryStats,
      topLocations: locationStats,
      recentJobs,
    });
  } catch (e) {
    next(e);
  }
});

// GET popular jobs (public route)
router.get("/popular", async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const popularJobs = await Job.find({ status: "active" })
      .sort({ views: -1, applications: -1 })
      .limit(Number(limit));

    res.json(popularJobs);
  } catch (e) {
    next(e);
  }
});

// GET jobs by employment type (public route)
router.get("/type/:employmentType", async (req, res, next) => {
  try {
    const { employmentType } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Job.find({ employmentType, status: "active" })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments({ employmentType, status: "active" }),
    ]);

    res.json({ items, page: Number(page), limit: Number(limit), total });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

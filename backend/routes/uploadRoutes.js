const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../cloudinary");
const auth = require("../middleware/auth");
const Job = require("../models/jobModel");
const { Readable } = require("stream");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File size and type validation
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

// Set up multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary
 * @access  Private (Admin only)
 */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image file",
      });
    }

    // Get folder name from environment variable or use default
    const folder = process.env.CLOUDINARY_FOLDER || "job-ads";

    // Create a stream from the buffer
    const stream = Readable.from(req.file.buffer);

    // Create a promise to handle the stream upload
    const streamUpload = (stream) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
    };

    // Upload image to Cloudinary
    const result = await streamUpload(stream);

    // If jobId is provided, update the job with the new image URL
    if (req.body.jobId) {
      const job = await Job.findById(req.body.jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      job.imageUrl = result.secure_url;
      await job.save();

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        jobId: req.body.jobId,
      });
    }

    // Return the upload result
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 5MB",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

module.exports = router;

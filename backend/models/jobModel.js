const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    category: { type: String, index: true },
    location: { type: String, index: true },
    publishDate: { type: Date, required: true },
    lastDate: { type: Date, required: true },
    source: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    // Optional fields for enhanced job data
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Temporary",
        "Freelance",
      ],
      index: true,
    },
    applyUrl: { type: String },
    requirements: { type: String },
    benefits: { type: String },
    experience: { type: String },
    education: { type: String },
    skills: [{ type: String }],
    tags: [{ type: String, index: true }],
    status: {
      type: String,
      enum: ["active", "expired", "closed", "draft"],
      default: "active",
      index: true,
    },
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for full text search
jobSchema.index({
  title: "text",
  organization: "text",
  description: "text",
  requirements: "text",
  benefits: "text",
});

// Compound indexes for filtering and sorting
jobSchema.index({ category: 1, location: 1, publishDate: -1 });
jobSchema.index({ employmentType: 1, status: 1, publishDate: -1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ status: 1, lastDate: 1 });
jobSchema.index({ views: -1 });
jobSchema.index({ applications: -1 });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

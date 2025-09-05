const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
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
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    publishDate: {
      type: Date,
      required: [true, "Publish date is required"],
      default: Date.now,
    },
    lastDate: {
      type: Date,
      required: [true, "Last date to apply is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    adImage: {
      type: String, // URL to the image
      required: [true, "Advertisement image is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Text indexes for search functionality
jobSchema.index({
  title: "text",
  organization: "text",
  description: "text",
  tags: "text",
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

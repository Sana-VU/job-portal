const mongoose = require("mongoose");
require("dotenv").config();
const Job = require("../models/jobModel");

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || "job-portal",
  });
  await Job.deleteMany({});
  await Job.insertMany([
    {
      title: "Senior Software Engineer",
      organization: "Tech Solutions Ltd",
      category: "IT & Software",
      location: "Islamabad",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      source: "Dawn",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Software+Engineer+Ad",
      description:
        "We are looking for an experienced Software Engineer to join our dynamic team. The ideal candidate will have strong skills in web development, database design, and problem-solving.",
    },
    {
      title: "Bank Manager",
      organization: "National Bank",
      category: "Banking & Finance",
      location: "Karachi",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      source: "The News",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Bank+Manager+Ad",
      description:
        "Manage all operations and staff at the branch level. Ensure compliance with banking regulations and provide excellent customer service.",
    },
    {
      title: "Medical Doctor",
      organization: "City Hospital",
      category: "Healthcare",
      location: "Lahore",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      source: "Express Tribune",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Medical+Doctor+Ad",
      description:
        "We are seeking a licensed Medical Doctor to join our hospital. The candidate will diagnose and treat patients, maintain medical records, and collaborate with other healthcare professionals.",
    },
    {
      title: "Assistant Professor",
      organization: "Public University",
      category: "Education",
      location: "Peshawar",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      source: "Jang",
      imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Professor+Ad",
      description:
        "The Department of Computer Science is seeking candidates for an Assistant Professor position. The ideal candidate will have a PhD in Computer Science or a related field.",
    },
    {
      title: "Civil Engineer",
      organization: "Construction Corp",
      category: "Engineering",
      location: "Islamabad",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      source: "Dawn",
      imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Engineer+Ad",
      description:
        "Design and oversee construction projects. Review project specifications and make necessary modifications to ensure structural integrity and compliance with regulations.",
    },
    {
      title: "Administrative Officer",
      organization: "Government Department",
      category: "Government",
      location: "Karachi",
      publishDate: new Date(),
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
      source: "Nawa-i-Waqt",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Admin+Officer+Ad",
      description:
        "Manage administrative functions, coordinate office activities, and maintain records. The candidate should have excellent organizational and communication skills.",
    },
  ]);
  console.log("Seeded jobs ✔");
  await mongoose.connection.close();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});

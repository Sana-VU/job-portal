import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Set the MONGO_URI environment variable for the server
  process.env.MONGO_URI = uri;
  process.env.MONGO_DB = "test-db";

  // Import the app after setting the environment
  const serverModule = await import("../server");
  app = serverModule.default;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongo) {
    await mongo.stop();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

it("GET /api/jobs returns seeded job", async () => {
  // Use the existing Job model from the server
  const Job =
    mongoose.models.Job ||
    mongoose.model(
      "Job",
      new mongoose.Schema({
        title: { type: String, required: true },
        organization: { type: String, required: true },
        category: String,
        location: String,
        source: String,
        publishDate: { type: Date, required: true },
        lastDate: { type: Date, required: true },
        imageUrl: String,
        description: String,
      })
    );

  await Job.create({
    title: "Assistant Director (BPS-17)",
    organization: "Ministry of ABC",
    category: "Government",
    location: "Islamabad",
    source: "Dawn",
    publishDate: new Date(),
    lastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    imageUrl: "https://example.com/ad.jpg",
  });

  const res = await request(app).get("/api/jobs").expect(200);
  expect(res.body).toHaveProperty("items");
  expect(res.body).toHaveProperty("page");
  expect(res.body).toHaveProperty("limit");
  expect(res.body).toHaveProperty("total");
  expect(Array.isArray(res.body.items)).toBe(true);
  expect(res.body.items.length).toBe(1);
});

import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../server"; // export app from server.js

describe("GET /api/jobs", () => {
  it("returns 200 and jobs data", async () => {
    const res = await request(app).get("/api/jobs");

    // Check status code
    expect(res.status).toBe(200);

    // Check response structure
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("data");

    // Check that data is an array
    expect(Array.isArray(res.body.data)).toBe(true);

    // If we have jobs, verify their structure
    if (res.body.data.length > 0) {
      const job = res.body.data[0];
      expect(job).toHaveProperty("title");
      expect(job).toHaveProperty("company");
      expect(job).toHaveProperty("location");
    }
  });
});

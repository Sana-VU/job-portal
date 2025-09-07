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
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("total");

    // Check that items is an array
    expect(Array.isArray(res.body.items)).toBe(true);

    // If we have jobs, verify their structure
    if (res.body.items.length > 0) {
      const job = res.body.items[0];
      expect(job).toHaveProperty("title");
      expect(job).toHaveProperty("organization");
      expect(job).toHaveProperty("location");
    }
  });
});

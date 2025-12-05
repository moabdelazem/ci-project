import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Express App", () => {
  describe("GET /", () => {
    it("should return welcome message with status 200", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Welcome to the Express server!"
      );
      expect(response.body).toHaveProperty("environment");
      expect(response.body).toHaveProperty("version", "1.0.0");
    });
  });

  describe("GET /health", () => {
    it("should return OK status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
    });

    it("should return valid ISO timestamp", async () => {
      const response = await request(app).get("/health");

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });

  describe("404 handling", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown-route");

      expect(response.status).toBe(404);
    });
  });
});

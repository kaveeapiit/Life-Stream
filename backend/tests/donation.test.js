import request from "supertest";
import express from "express";
import cors from "cors";
import donationRoutes from "../routes/donationRoutes.js";
import pool from "../config/db.js";

const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware for testing
const mockAuth = (req, res, next) => {
  req.user = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
  };
  next();
};

app.use("/api/donations", mockAuth, donationRoutes);

describe("Donation API", () => {
  const testDonation = {
    name: "Test Donor",
    email: "donor@example.com",
    bloodType: "O+",
    location: "Test City",
  };

  beforeAll(async () => {
    // Clean up test data
    try {
      await pool.query("DELETE FROM donations WHERE email = $1", [
        testDonation.email,
      ]);
    } catch (error) {
      console.log("Cleanup not needed:", error.message);
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await pool.query("DELETE FROM donations WHERE email = $1", [
        testDonation.email,
      ]);
    } catch (error) {
      console.log("Cleanup failed:", error.message);
    }
  });

  describe("POST /api/donations/submit", () => {
    test("should submit donation successfully", async () => {
      const response = await request(app)
        .post("/api/donations/submit")
        .send(testDonation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Donation submitted successfully"
      );
    });

    test("should fail with missing required fields", async () => {
      const incompleteDonation = {
        name: "Test Donor",
        // missing email, bloodType, location
      };

      const response = await request(app)
        .post("/api/donations/submit")
        .send(incompleteDonation);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/donations/history", () => {
    test("should get donation history for authenticated user", async () => {
      const response = await request(app).get("/api/donations/history");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});

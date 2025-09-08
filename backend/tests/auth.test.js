import request from "supertest";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "../routes/authRoutes.js";
import pool from "../config/db.js";

const app = express();

// Setup middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use("/api/auth", authRoutes);

describe("Authentication API", () => {
  let testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "TestPassword123!",
    bloodType: "O+",
  };

  beforeAll(async () => {
    // Clean up test data before running tests
    try {
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    } catch (error) {
      console.log("Cleanup not needed or failed:", error.message);
    }
  });

  afterAll(async () => {
    // Clean up test data after running tests
    try {
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
      await pool.end();
    } catch (error) {
      console.log("Cleanup failed:", error.message);
    }
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "Registration successful"
      );
      expect(response.body.user).toHaveProperty("email", testUser.email);
      expect(response.body.user).not.toHaveProperty("password");
    });

    test("should fail to register user with missing fields", async () => {
      const incompleteUser = {
        name: "Test User",
        email: "incomplete@example.com",
        // missing password and bloodType
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("required");
    });

    test("should fail to register user with duplicate email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("already exists");
    });

    test("should fail to register user with invalid email format", async () => {
      const invalidUser = {
        ...testUser,
        email: "invalid-email",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login user with correct credentials", async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", testUser.email);
      expect(response.body.user).not.toHaveProperty("password");
    });

    test("should fail login with incorrect password", async () => {
      const loginData = {
        email: testUser.email,
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    test("should fail login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    test("should fail login with missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout user successfully", async () => {
      const response = await request(app).post("/api/auth/logout").expect(200);

      expect(response.body).toHaveProperty("message", "Logout successful");
    });
  });
});

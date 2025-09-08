import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController.js";
import * as AuthModel from "../models/AuthModel.js";

// Mock the AuthModel
jest.mock("../models/AuthModel.js");

describe("Auth Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should register user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        bloodType: "O+",
      };

      mockReq.body = userData;

      AuthModel.findUserByEmail.mockResolvedValue(null);
      AuthModel.createUser.mockResolvedValue({
        id: 1,
        name: userData.name,
        email: userData.email,
      });

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Registration successful",
        user: expect.objectContaining({
          id: 1,
          name: userData.name,
          email: userData.email,
        }),
      });
    });

    test("should fail registration with missing fields", async () => {
      mockReq.body = {
        name: "Test User",
        // missing email, password, bloodType
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.stringContaining("required"),
      });
    });

    test("should fail registration for existing user", async () => {
      const userData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
        bloodType: "O+",
      };

      mockReq.body = userData;

      AuthModel.findUserByEmail.mockResolvedValue({
        id: 1,
        email: userData.email,
      });

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User already exists with this email",
      });
    });
  });

  describe("login", () => {
    test("should login user successfully", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        id: 1,
        name: "Test User",
        email: loginData.email,
        password: await bcrypt.hash(loginData.password, 10),
        bloodType: "O+",
      };

      mockReq.body = loginData;

      AuthModel.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue("mock-jwt-token");

      await login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        token: "mock-jwt-token",
        user: expect.objectContaining({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        }),
      });
    });

    test("should fail login with invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        password: await bcrypt.hash("correctpassword", 10),
      };

      mockReq.body = loginData;

      AuthModel.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.stringContaining("credentials"),
      });
    });

    test("should fail login with non-existent user", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockReq.body = loginData;

      AuthModel.findUserByEmail.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.stringContaining("credentials"),
      });
    });
  });
});

import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  test("register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Jest User",
        email: `jest${Date.now()}@test.com`,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
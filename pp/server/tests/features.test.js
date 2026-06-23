import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

jest.setTimeout(30000);

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const register = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Feature User",
      email: `feature${Date.now()}@test.com`,
      password: "123456"
    });

  token = register.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Feature API", () => {
  test("returns features", async () => {
    const res = await request(app)
      .get("/api/analytics/features")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
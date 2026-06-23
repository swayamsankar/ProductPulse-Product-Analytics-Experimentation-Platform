import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

console.log("MONGODB_URI =", process.env.MONGODB_URI);

jest.setTimeout(30000);

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const register = await request(app)
    .post("/api/auth/register")
    .send({
      name: "KPI User",
      email: `kpi${Date.now()}@test.com`,
      password: "123456"
    });

  token = register.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Analytics KPI", () => {
  test("should return KPI data", async () => {
    const res = await request(app)
      .get("/api/analytics/kpis")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("dau");
    expect(res.body).toHaveProperty("mau");
    expect(res.body).toHaveProperty("conversionPct");
    expect(res.body).toHaveProperty("totalEvents");
  });
});
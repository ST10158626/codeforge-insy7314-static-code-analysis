const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

// Test-only secret. Never use this value outside automated tests.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret-for-hustlehub";
const { app } = require("../src/server");

test("GET /api/health returns a successful health response", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
});

test("security headers are returned", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["x-frame-options"], "DENY");
  assert.equal(response.headers["content-security-policy"] !== undefined, true);
});

test("unknown endpoints return JSON 404", async () => {
  const response = await request(app).get("/api/not-a-real-route");
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});

test("protected gig listing rejects a request without a JWT", async () => {
  const response = await request(app).get("/api/gigs");
  assert.equal(response.status, 401);
});

test("registration rejects missing required fields", async () => {
  const response = await request(app).post("/api/auth/register").send({});
  assert.equal(response.status, 400);
});

test("unsafe MongoDB-style body keys are rejected", async () => {
  const response = await request(app).post("/api/auth/login").send({ "$where": "true" });
  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});

test("freelancer income endpoint requires authentication", async () => {
  const response = await request(app).get("/api/bookings/freelancer/income");
  assert.equal(response.status, 401);
});

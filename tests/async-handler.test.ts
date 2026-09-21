import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { asyncHandler, errorHandler, NotFoundError } from "../src";

describe("asyncHandler()", () => {
  it("passes successful async handlers through", async () => {
    const app = express();

    app.get(
      "/",
      asyncHandler(async (_req, res) => {
        res.json({ success: true });
      }),
    );

    app.use(errorHandler());

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
    });
  });

  it("forwards HttpError instances to errorHandler", async () => {
    const app = express();

    app.get(
      "/",
      asyncHandler(async () => {
        throw NotFoundError("User");
      }),
    );

    app.use(errorHandler());

    const res = await request(app).get("/");

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.message).toBe("User not found");
  });

  it("forwards native errors to errorHandler", async () => {
    const app = express();

    app.get(
      "/",
      asyncHandler(async () => {
        throw new Error("Boom");
      }),
    );

    app.use(errorHandler());

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body.code).toBe("INTERNAL_SERVER_ERROR");
    expect(res.body.message).toBe("Internal server error");
  });
});

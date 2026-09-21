import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import {
  errorHandler,
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../src";

describe("errorHandler()", () => {
  const app = express();

  app.get("/not-found", () => {
    throw NotFoundError("User");
  });

  app.post("/bad-request", () => {
    throw BadRequestError("Email is required");
  });

  app.get("/internal", () => {
    throw InternalServerError("Something failed");
  });

  app.get("/native-error", () => {
    throw new Error("Unexpected");
  });

  app.use(errorHandler());

  it("handles NotFoundError", async () => {
    const res = await request(app).get("/not-found");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      status: 404,
      code: "NOT_FOUND",
      message: "User not found",
    });
  });

  it("handles BadRequestError", async () => {
    const res = await request(app).post("/bad-request");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      status: 400,
      code: "BAD_REQUEST",
      message: "Email is required",
    });
  });

  it("handles InternalServerError", async () => {
    const res = await request(app).get("/internal");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something failed",
    });
  });

  it("handles unknown errors as HTTP 500", async () => {
    const res = await request(app).get("/native-error");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  });
});

describe("errorHandler() options", () => {
  it("supports a custom response formatter", async () => {
    const app = express();

    app.get("/", () => {
      throw NotFoundError("Workspace");
    });

    app.use(
      errorHandler({
        format: (error, req) => ({
          success: false,
          error: error.code,
          message: error.message,
          path: req.originalUrl,
        }),
      }),
    );

    const res = await request(app).get("/");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: "NOT_FOUND",
      message: "Workspace not found",
      path: "/",
    });
  });

  it("includes stack trace when enabled", async () => {
    const app = express();

    app.get("/", () => {
      throw InternalServerError("Boom");
    });

    app.use(
      errorHandler({
        includeStack: true,
      }),
    );

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body.stack).toBeDefined();
    expect(typeof res.body.stack).toBe("string");
  });

  it("does not include stack trace by default", async () => {
    const app = express();

    app.get("/", () => {
      throw InternalServerError("Boom");
    });

    app.use(errorHandler());

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body.stack).toBeUndefined();
  });

  it("does not include stack for unknown errors even when enabled", async () => {
    const app = express();

    app.get("/", () => {
      throw new Error("Unexpected");
    });

    app.use(
      errorHandler({
        includeStack: true,
      }),
    );

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  });
});

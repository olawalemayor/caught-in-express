import { describe, expect, it } from "vitest";
import { HttpError } from "../src";

describe("HttpError", () => {
  it("extends the native Error class", () => {
    const err = new HttpError(404, "NOT_FOUND", "User not found");

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
  });

  it("assigns status, code, message and name", () => {
    const err = new HttpError(418, "I_AM_A_TEAPOT", "Tea time");

    expect(err.status).toBe(418);
    expect(err.code).toBe("I_AM_A_TEAPOT");
    expect(err.message).toBe("Tea time");
    expect(err.name).toBe("HttpError");
  });

  it("stores the original cause", () => {
    const cause = new Error("Database failure");

    const err = new HttpError(500, "INTERNAL_SERVER_ERROR", "Boom", cause);

    expect(err.cause).toBe(cause);
  });

  it("works without a cause", () => {
    const err = new HttpError(500, "INTERNAL_SERVER_ERROR", "Boom");

    expect(err.cause).toBeUndefined();
  });
});

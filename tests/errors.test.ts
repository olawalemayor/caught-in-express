import { describe, expect, it } from "vitest";
import {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../src";

describe("Error factories", () => {
  describe("BadRequestError", () => {
    it("creates default error", () => {
      const err = BadRequestError();

      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.code).toBe("BAD_REQUEST");
      expect(err.message).toBe("Bad request");
    });

    it("accepts custom message", () => {
      const err = BadRequestError("Email is required");

      expect(err.message).toBe("Email is required");
    });

    it("accepts an Error cause", () => {
      const cause = new Error("Validation failed");

      const err = BadRequestError(cause, "Invalid payload");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Invalid payload");
    });
  });

  describe("UnauthorizedError", () => {
    it("creates default error", () => {
      const err = UnauthorizedError();

      expect(err.status).toBe(401);
      expect(err.code).toBe("UNAUTHORIZED");
      expect(err.message).toBe("Unauthorized");
    });

    it("accepts custom message", () => {
      expect(UnauthorizedError("Invalid token").message).toBe("Invalid token");
    });

    it("accepts a cause", () => {
      const cause = new Error("JWT expired");

      const err = UnauthorizedError(cause, "Session expired");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Session expired");
    });
  });

  describe("ForbiddenError", () => {
    it("creates default error", () => {
      const err = ForbiddenError();

      expect(err.status).toBe(403);
      expect(err.code).toBe("FORBIDDEN");
      expect(err.message).toBe("Forbidden");
    });

    it("accepts custom message", () => {
      expect(ForbiddenError("Admins only").message).toBe("Admins only");
    });

    it("accepts a cause", () => {
      const cause = new Error("ACL failed");

      const err = ForbiddenError(cause, "Access denied");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Access denied");
    });
  });

  describe("NotFoundError", () => {
    it("creates default resource message", () => {
      const err = NotFoundError("User");

      expect(err.status).toBe(404);
      expect(err.code).toBe("NOT_FOUND");
      expect(err.message).toBe("User not found");
    });

    it("accepts custom message", () => {
      const err = NotFoundError("User", "User with ID 42 not found");

      expect(err.message).toBe("User with ID 42 not found");
    });

    it("accepts a cause", () => {
      const cause = new Error("Mongo");

      const err = NotFoundError(cause, "Lookup failed");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Lookup failed");
    });

    it("falls back to default message", () => {
      const err = NotFoundError();

      expect(err.message).toBe("Resource not found");
    });
  });

  describe("ConflictError", () => {
    it("creates default error", () => {
      const err = ConflictError();

      expect(err.status).toBe(409);
      expect(err.code).toBe("CONFLICT");
      expect(err.message).toBe("Conflict");
    });

    it("accepts custom message", () => {
      expect(ConflictError("Email already exists").message).toBe(
        "Email already exists",
      );
    });

    it("accepts a cause", () => {
      const cause = new Error("Duplicate key");

      const err = ConflictError(cause, "Username already taken");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Username already taken");
    });
  });

  describe("InternalServerError", () => {
    it("creates default error", () => {
      const err = InternalServerError();

      expect(err.status).toBe(500);
      expect(err.code).toBe("INTERNAL_SERVER_ERROR");
      expect(err.message).toBe("Internal server error");
    });

    it("accepts custom message", () => {
      expect(InternalServerError("Something exploded").message).toBe(
        "Something exploded",
      );
    });

    it("accepts a cause", () => {
      const cause = new Error("Redis down");

      const err = InternalServerError(cause, "Cache unavailable");

      expect(err.cause).toBe(cause);
      expect(err.message).toBe("Cache unavailable");
    });
  });
});

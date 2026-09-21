import type { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/http.error.js";
import type { ErrorHandlerOptions } from "../types.js";

export function errorHandler(
  options: ErrorHandlerOptions = {},
): ErrorRequestHandler {
  const { format, includeStack = false } = options;

  return (err, req, res, _next) => {
    if (err instanceof HttpError) {
      const response = format?.(err, req) ?? {
        success: false,
        status: err.status,
        code: err.code,
        message: err.message,
      };

      if (includeStack && err.stack) {
        (response as Record<string, unknown>).stack = err.stack;
      }

      return res.status(err.status).json(response);
    }

    return res.status(500).json({
      success: false,
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  };
}

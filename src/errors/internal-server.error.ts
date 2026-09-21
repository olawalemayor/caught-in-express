import { HttpError } from "./http.error.js";

class InternalServerErrorClass extends HttpError {
  constructor(message = "Internal server error", cause?: unknown) {
    super(500, "INTERNAL_SERVER_ERROR", message, cause);
  }
}

/**
 * Creates a **500 Internal Server Error**.
 *
 * Use this when an unexpected server-side error occurs.
 *
 * @example
 * throw InternalServerError();
 *
 * @example
 * try {
 *   await service.process();
 * } catch (err) {
 *   throw InternalServerError(err as Error, "Failed to process request");
 * }
 */

export function InternalServerError(): HttpError;
export function InternalServerError(message?: string): HttpError;
export function InternalServerError(cause: Error, message?: string): HttpError;
export function InternalServerError(
  messageOrCause?: string | Error,
  message?: string,
): HttpError {
  if (messageOrCause instanceof Error) {
    return new InternalServerErrorClass(
      message ?? "Internal server error",
      messageOrCause,
    );
  }

  if (typeof messageOrCause === "string") {
    return new InternalServerErrorClass(messageOrCause);
  }

  return new InternalServerErrorClass();
}

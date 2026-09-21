import { HttpError } from "./http.error.js";

class UnauthorizedErrorClass extends HttpError {
  constructor(message = "Unauthorized", cause?: unknown) {
    super(401, "UNAUTHORIZED", message, cause);
  }
}

/**
 * Creates a **401 Unauthorized** error.
 *
 * Use this when authentication is missing or invalid.
 *
 * @example
 * throw UnauthorizedError();
 *
 * @example
 * throw UnauthorizedError("Invalid access token");
 */
export function UnauthorizedError(): HttpError;
export function UnauthorizedError(message?: string): HttpError;
export function UnauthorizedError(cause: Error, message?: string): HttpError;
export function UnauthorizedError(
  messageOrCause?: string | Error,
  message?: string,
): HttpError {
  if (messageOrCause instanceof Error) {
    return new UnauthorizedErrorClass(
      message ?? "Unauthorized",
      messageOrCause,
    );
  }

  if (typeof messageOrCause === "string") {
    return new UnauthorizedErrorClass(messageOrCause);
  }

  return new UnauthorizedErrorClass();
}

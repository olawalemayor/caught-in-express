import { HttpError } from "./http.error.js";

class ForbiddenErrorClass extends HttpError {
  constructor(message = "Forbidden", cause?: unknown) {
    super(403, "FORBIDDEN", message, cause);
  }
}

/**
 * Creates a **403 Forbidden** error.
 *
 * Use this when the authenticated user does not have permission
 * to perform the requested action.
 *
 * @example
 * throw ForbiddenError();
 *
 * @example
 * throw ForbiddenError("You do not have permission to delete this resource");
 */
export function ForbiddenError(): HttpError;
export function ForbiddenError(message?: string): HttpError;
export function ForbiddenError(cause: Error, message?: string): HttpError;
export function ForbiddenError(
  messageOrCause?: string | Error,
  message?: string,
): HttpError {
  if (messageOrCause instanceof Error) {
    return new ForbiddenErrorClass(message ?? "Forbidden", messageOrCause);
  }

  if (typeof messageOrCause === "string") {
    return new ForbiddenErrorClass(messageOrCause);
  }

  return new ForbiddenErrorClass();
}

import { HttpError } from "./http.error.js";

class BadRequestErrorClass extends HttpError {
  constructor(message = "Bad request", cause?: unknown) {
    super(400, "BAD_REQUEST", message, cause);
  }
}

/**
 * Creates a **400 Bad Request** error.
 *
 * Use this when the client sends an invalid request.
 *
 * @example
 * throw BadRequestError("Email is required");
 *
 * @example
 * try {
 *   await service.create(data);
 * } catch (err) {
 *   throw BadRequestError(err as Error, "Invalid request payload");
 * }
 */
export function BadRequestError(): HttpError;
export function BadRequestError(message?: string): HttpError;
export function BadRequestError(cause: Error, message?: string): HttpError;
export function BadRequestError(
  messageOrCause?: string | Error,
  message?: string,
): HttpError {
  if (messageOrCause instanceof Error) {
    return new BadRequestErrorClass(message ?? "Bad request", messageOrCause);
  }

  if (typeof messageOrCause === "string") {
    return new BadRequestErrorClass(messageOrCause);
  }

  return new BadRequestErrorClass();
}

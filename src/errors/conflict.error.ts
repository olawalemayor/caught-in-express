import { HttpError } from "./http.error.js";

class ConflictErrorClass extends HttpError {
  constructor(message = "Conflict", cause?: unknown) {
    super(409, "CONFLICT", message, cause);
  }
}

/**
 * Creates a **409 Conflict** error.
 *
 * Use this when a resource already exists or a request conflicts
 * with the current state of the server.
 *
 * @example
 * throw ConflictError("Email already exists");
 *
 * @example
 * try {
 *   await service.create(data);
 * } catch (err) {
 *   throw ConflictError(err as Error, "Email already exists");
 * }
 */
export function ConflictError(): HttpError;
export function ConflictError(message?: string): HttpError;
export function ConflictError(cause: Error, message?: string): HttpError;
export function ConflictError(
  messageOrCause?: string | Error,
  message?: string,
): HttpError {
  if (messageOrCause instanceof Error) {
    return new ConflictErrorClass(message ?? "Conflict", messageOrCause);
  }

  if (typeof messageOrCause === "string") {
    return new ConflictErrorClass(messageOrCause);
  }

  return new ConflictErrorClass();
}

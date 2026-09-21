import { HttpError } from "./http.error.js";

class NotFoundErrorClass extends HttpError {
  constructor(message = "Resource not found", cause?: unknown) {
    super(404, "NOT_FOUND", message, cause);
  }
}

/**
 * Creates a **404 Not Found** error.
 *
 * Pass a resource name to automatically generate a default message.
 *
 * @example
 * throw NotFoundError("User");
 * // "User not found"
 *
 * @example
 * throw NotFoundError("Workspace", "Workspace with ID 123 not found");
 *
 * @example
 * try {
 *   await service.findById(id);
 * } catch (err) {
 *   throw NotFoundError(err as Error, "Failed to fetch user");
 * }
 */
export function NotFoundError(): HttpError;
export function NotFoundError(resource: string): HttpError;
export function NotFoundError(resource: string, message: string): HttpError;
export function NotFoundError(cause: Error, message?: string): HttpError;

export function NotFoundError(
  resourceOrCause?: string | Error,
  message?: string,
): HttpError {
  if (resourceOrCause instanceof Error) {
    return new NotFoundErrorClass(
      message ?? "Resource not found",
      resourceOrCause,
    );
  }

  if (typeof resourceOrCause === "string") {
    return new NotFoundErrorClass(message ?? `${resourceOrCause} not found`);
  }

  return new NotFoundErrorClass();
}

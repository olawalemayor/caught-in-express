import type { RequestHandler } from "express";

/**
 * Wraps an asynchronous Express route handler and forwards rejected promises
 * to the next error middleware.
 *
 * Works with both Express 4 and Express 5.
 *
 * @example
 * app.get(
 *   "/users/:id",
 *   asyncHandler(async (req, res) => {
 *     const user = await userService.find(req.params.id);
 *
 *     if (!user) throw NotFoundError("User");
 *
 *     res.json(user);
 *   }),
 * );
 */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

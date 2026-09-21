import type { Request } from "express";
import { HttpError } from "./errors/http.error.js";

export interface DefaultErrorResponse {
  success: boolean;
  status: number;
  code: string;
  message: string;
  stack?: string;
}

export interface ErrorHandlerOptions {
  /**
   * Customize the HTTP error response body.
   */
  format?: (error: HttpError, req: Request) => Record<string, unknown>;

  /**
   * Include stack traces in the response.
   * Defaults to false.
   */
  includeStack?: boolean;
}

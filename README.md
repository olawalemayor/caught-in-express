# express-error-handler

> A lightweight, TypeScript-first error handling package for **Express 5**.

Stop writing repetitive `res.status(...).json(...)` for errors. Throw HTTP errors anywhere in your application and let a single middleware handle the response.

```ts
if (!user) {
  throw NotFoundError("User");
}
```

## Features

- 🚀 Throw HTTP errors instead of sending responses manually.
- ✨ No `new` keyword required.
- 📦 Built for Express 5 with TypeScript support.
- 🧩 Customizable global error response format.
- 🔒 Preserves original errors using `Error.cause`.
- 📖 Rich IntelliSense with JSDoc.

---

## Installation

```bash
npm install express-error-handler
```

**Requirements**

- Node.js **22 LTS (Jod)** or later.
- Express **5.x**.

---

## Quick Start

### Register the middleware

```ts
import express from "express";
import { errorHandler } from "express-error-handler";

const app = express();

app.use(express.json());

// Register after all routes.
app.use(errorHandler());

app.listen(3000);
```

### Throw errors in your routes

```ts
import { NotFoundError, BadRequestError } from "express-error-handler";

app.get("/users/:id", async (req, res) => {
  const user = await findUser(req.params.id);

  if (!user) {
    throw NotFoundError("User");
  }

  res.json(user);
});

app.post("/users", async (req, res) => {
  if (!req.body.email) {
    throw BadRequestError("Email is required.");
  }

  res.status(201).json({
    message: "User created.",
  });
});
```

No `next(error)` or `res.status(...).json(...)` for error cases.

---

## Response Format

By default, handled errors return:

```json
{
  "success": false,
  "status": 404,
  "code": "NOT_FOUND",
  "message": "User not found"
}
```

Unexpected errors return:

```json
{
  "success": false,
  "status": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

## Available Errors

| Error                   | Status | Default Message         |
| ----------------------- | -----: | ----------------------- |
| `BadRequestError()`     |    400 | `Bad request`           |
| `UnauthorizedError()`   |    401 | `Unauthorized`          |
| `ForbiddenError()`      |    403 | `Forbidden`             |
| `NotFoundError("User")` |    404 | `User not found`        |
| `ConflictError()`       |    409 | `Conflict`              |
| `InternalServerError()` |    500 | `Internal server error` |

---

## Error Usage

### Default message

```ts
throw NotFoundError("User");
```

Response:

```json
{
  "success": false,
  "status": 404,
  "code": "NOT_FOUND",
  "message": "User not found"
}
```

### Custom message

```ts
throw NotFoundError("User", "User with ID 123 was not found.");
```

Response:

```json
{
  "success": false,
  "status": 404,
  "code": "NOT_FOUND",
  "message": "User with ID 123 was not found."
}
```

### Wrap an existing error

```ts
try {
  await createUser(data);
} catch (err) {
  throw ConflictError(err as Error, "Email already exists.");
}
```

The client receives a clean response while the original error is preserved internally.

---

## Custom Error Responses

Customize the response shape globally.

```ts
import { errorHandler } from "express-error-handler";

app.use(
  errorHandler({
    format: (error, req) => ({
      success: false,
      error: error.code,
      message: error.message,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    }),
  }),
);
```

Response:

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "User not found",
  "path": "/users/123",
  "timestamp": "2026-09-21T13:30:00.000Z"
}
```

---

## Include Stack Traces

Useful during development.

```ts
app.use(
  errorHandler({
    includeStack: true,
  }),
);
```

Response:

```json
{
  "success": false,
  "status": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error",
  "stack": "Error: ..."
}
```

**Recommended only for development.**

---

## Async Handler (Optional)

Express 5 automatically forwards rejected promises from async route handlers.

This package also exports an optional `asyncHandler()` utility for compatibility with Express 4 or projects that prefer wrapping handlers.

```ts
import { asyncHandler, NotFoundError } from "express-error-handler";

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);

    if (!user) {
      throw NotFoundError("User");
    }

    res.json(user);
  }),
);
```

---

## TypeScript

The package ships with type declarations out of the box.

```ts
import { HttpError, NotFoundError } from "express-error-handler";

try {
  throw NotFoundError("User");
} catch (err) {
  if (err instanceof HttpError) {
    console.log(err.status); // 404
    console.log(err.code); // NOT_FOUND
    console.log(err.message); // User not found
  }
}
```

---

## API

### Errors

```ts
BadRequestError(message?)
BadRequestError(cause, message?)

UnauthorizedError(message?)
UnauthorizedError(cause, message?)

ForbiddenError(message?)
ForbiddenError(cause, message?)

NotFoundError(resource?)
NotFoundError(resource, message?)
NotFoundError(cause, message?)

ConflictError(message?)
ConflictError(cause, message?)

InternalServerError(message?)
InternalServerError(cause, message?)
```

### Middleware

```ts
errorHandler(options?)
```

#### Options

| Option         | Type                     | Description                                             |
| -------------- | ------------------------ | ------------------------------------------------------- |
| `format`       | `(error, req) => object` | Customize the JSON response.                            |
| `includeStack` | `boolean`                | Include stack traces in responses. Defaults to `false`. |

### Async Utility

```ts
asyncHandler(handler);
```

Wraps asynchronous Express handlers and forwards rejected promises to the error middleware.

---

## Project Status

`express-error-handler` currently supports **Express 5** and is designed for modern TypeScript projects running on **Node.js 22 LTS or later**.

Contributions and issues are welcome.

---

## License

MIT

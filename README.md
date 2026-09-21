# express-error-handler

A lightweight, TypeScript-first error handling package for **Express 5** that lets you throw HTTP errors instead of manually sending error responses.

No `res.status(...).json(...)` in your controllers. Just throw an error and let the middleware handle the response.

## Features

- 🚀 Simple error helpers (`NotFoundError`, `BadRequestError`, etc.).
- ✅ No `new` keyword required.
- 🎯 Global Express error middleware.
- 📝 Sensible default messages with optional overrides.
- 🔒 TypeScript support out of the box.

---

## Installation

```bash
npm install express-error-handler
```

Express 5 is required.

```bash
npm install express
```

---

## Quick Start

### 1. Register the middleware

```ts
import express from "express";
import { errorHandler } from "express-error-handler";

const app = express();

app.use(express.json());

// Your routes here...

app.use(errorHandler());

app.listen(3000);
```

### 2. Throw errors inside your routes

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

  res.status(201).json({ message: "User created." });
});
```

No `next(error)` or `res.status(...).json(...)` for error cases.

---

## Response Format

Every handled error returns a consistent JSON response.

```json
{
  "success": false,
  "status": 404,
  "code": "NOT_FOUND",
  "message": "User not found"
}
```

Unknown errors return a `500 Internal Server Error`.

```json
{
  "success": false,
  "status": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

## Available Error Helpers

| Helper                  | Status | Default Message       |
| ----------------------- | ------ | --------------------- |
| `BadRequestError()`     | 400    | Bad request           |
| `UnauthorizedError()`   | 401    | Unauthorized          |
| `ForbiddenError()`      | 403    | Forbidden             |
| `NotFoundError("User")` | 404    | User not found        |
| `ConflictError()`       | 409    | Conflict              |
| `InternalServerError()` | 500    | Internal server error |

### Custom message

```ts
throw NotFoundError("User", "User with ID 123 does not exist.");
```

Response:

```json
{
  "success": false,
  "status": 404,
  "code": "NOT_FOUND",
  "message": "User with ID 123 does not exist."
}
```

---

## Wrapping Existing Errors

Preserve the original error while returning a client-friendly response.

```ts
import { ConflictError } from "express-error-handler";

try {
  await createUser(data);
} catch (err) {
  throw ConflictError(err, "Email already exists.");
}
```

---

## TypeScript

The package ships with TypeScript declarations.

```ts
import { HttpError } from "express-error-handler";

try {
  // ...
} catch (err) {
  if (err instanceof HttpError) {
    console.log(err.status);
    console.log(err.code);
  }
}
```

---

## License

MIT

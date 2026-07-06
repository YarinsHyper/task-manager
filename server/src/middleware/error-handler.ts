import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

// Express 4 auto-catches sync throws from routes and forwards them here.
// the responder (one for the whole app, decides the actual response)
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  // express.json() throws this for malformed request bodies -- a client
  // mistake, not a server bug, so it shouldn't be a 500.
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

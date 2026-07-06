import type { NextFunction, Request, Response } from "express";

// The status code isn't known until the response is actually sent, so this
// logs on the "finish" event rather than up front.
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });
  next();
}

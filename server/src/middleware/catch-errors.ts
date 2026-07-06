import type { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response) => void | Promise<void>;

// Catches both sync throws and async rejections and forwards either to
// next() -- a plain try/catch alone wouldn't catch a rejected promise, so
// this stays correct even if a handler becomes async later.
export function catchErrors(handler: Handler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      Promise.resolve(handler(req, res)).catch(next);
    } catch (err) {
      next(err);
    }
  };
}

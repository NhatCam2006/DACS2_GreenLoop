import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = (err as any).status ?? 500;
  res.status(status).json({ error: err.message ?? "Internal Server Error" });
};


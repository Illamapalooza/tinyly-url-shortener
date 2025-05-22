import { Request, Response, NextFunction } from "express";
import logger from "./logger";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const isOperational = "isOperational" in err ? err.isOperational : false;

  if (statusCode >= 500) {
    logger.error(`${err.name}: ${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${err.message}`);
  }

  res.status(statusCode).json({
    status: "error",
    message: isOperational ? err.message : "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

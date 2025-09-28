import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateSearchRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return next(new AppError('Search query is required and must be a non-empty string', 400));
  }

  if (query.length > 500) {
    return next(new AppError('Search query is too long (max 500 characters)', 400));
  }

  next();
};

export const validatePaginationParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.body;

  if (page && (!Number.isInteger(page) || page < 1)) {
    return next(new AppError('Page must be a positive integer', 400));
  }

  if (limit && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    return next(new AppError('Limit must be a positive integer between 1 and 100', 400));
  }

  next();
};

export const validatePaginationQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;

  if (page) {
    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new AppError('Page must be a positive integer', 400));
    }
  }

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return next(new AppError('Limit must be a positive integer between 1 and 100', 400));
    }
  }

  next();
};
import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';
import asyncHandler from '../utils/asyncHnadler';

const admin = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (
      req.user?.role !== 'admin' ||
      req.user?.role !== 'superAdmin' ||
      req.user?.role !== 'owner'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  },
);

export default admin;

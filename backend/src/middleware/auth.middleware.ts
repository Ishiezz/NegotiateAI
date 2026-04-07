import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { JwtPayload, UserRole } from '../../../shared/types/auth.types';

// protect: Verify JWT and attach user to request
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized — no token provided' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ error: 'Account is deactivated' });
      return;
    }

    req.user = user; // TypeScript knows this because of express.d.ts
    next();
  } catch {
    res.status(401).json({ error: 'Not authorized — invalid or expired token' });
  }
};

// authorize: Role-based access control after protect
export const authorize = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        error: `Role '${req.user.role}' is not permitted to access this resource`,
      });
      return;
    }

    next();
  };
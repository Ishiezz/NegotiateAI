// src/types/express.d.ts
// Extends the Express Request type to include the authenticated user
// This is the TypeScript way to add custom properties to framework types

import { IUser } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'safeyatra_secret_key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export function generateToken(user: JWTPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Helper to get single row from sql.js
function getRow(db: any, sql: string, params: any[] = []): any {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();
    return columns.reduce((obj: any, col: string, i: number) => {
      obj[col] = values[i];
      return obj;
    }, {});
  }
  stmt.free();
  return null;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required', code: 'NO_TOKEN' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
    return;
  }
  
  // Verify user still exists
  const db = getDatabase();
  const user = getRow(db, 'SELECT id, email, role, name FROM users WHERE id = ?', [decoded.id]);
  
  if (!user) {
    res.status(401).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
    return;
  }
  
  req.user = user;
  next();
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }
    
    next();
  };
}

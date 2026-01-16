import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface AuthRequest extends Request {
  userId?: number;
  token?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Simple JWT-like token generation (in production, use a proper JWT library)
 */
export function generateToken(userId: number, username: string): string {
  // Create a simple token format: userId.username.timestamp.signature
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${userId}.${username}.${timestamp}`;
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payload)
    .digest('hex');
  
  return `${payload}.${signature}`;
}

/**
 * Verify token and extract user info
 */
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 4) return null;

    const [userIdStr, username, timestamp, signature] = parts;
    const userId = parseInt(userIdStr);

    // Verify the signature
    const payload = `${userId}.${username}.${timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    // Check if token is not too old (optional - 24 hours)
    const tokenTime = parseInt(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);
    const maxAge = 24 * 60 * 60; // 24 hours

    if (currentTime - tokenTime > maxAge) {
      return null;
    }

    return { userId, username };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Middleware to verify JWT token
 * Usage: app.use(authMiddleware) or router.use(authMiddleware)
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.token = token;
  next();
}

/**
 * Middleware for optional auth (doesn't fail if token is missing)
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded) {
      req.userId = decoded.userId;
      req.token = token;
    }
  }

  next();
}

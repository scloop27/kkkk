import bcrypt from 'bcryptjs';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set('trust proxy', 1);
  app.use(getSession());
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Verify admin still exists
  const admin = await storage.getAdmin(req.session.adminId);
  if (!admin) {
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
    });
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  req.admin = admin;
  next();
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Extend Express types
declare global {
  namespace Express {
    interface Request {
      admin?: import('../shared/schema').Admin;
    }
    interface Session {
      adminId?: string;
    }
  }
}
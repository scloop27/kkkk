"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
exports.getSession = getSession;
exports.setupAuth = setupAuth;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const storage_1 = require("./storage");
function getSession() {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const pgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
    const sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        ttl: sessionTtl,
        tableName: "sessions",
    });
    return (0, express_session_1.default)({
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
async function setupAuth(app) {
    app.set('trust proxy', 1);
    app.use(getSession());
}
const isAuthenticated = async (req, res, next) => {
    if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Verify admin still exists
    const admin = await storage_1.storage.getAdmin(req.session.adminId);
    if (!admin) {
        req.session.destroy((err) => {
            if (err)
                console.error('Session destroy error:', err);
        });
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.admin = admin;
    next();
};
exports.isAuthenticated = isAuthenticated;
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}

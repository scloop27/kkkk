"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const vite_1 = require("vite");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
async function setupVite() {
    if (process.env.NODE_ENV !== 'production') {
        const vite = await (0, vite_1.createServer)({
            server: { middlewareMode: true },
            appType: 'spa',
            root: './client',
        });
        app.use(vite.ssrFixStacktrace);
        app.use(vite.middlewares);
    }
    else {
        app.use(express_1.default.static('dist'));
    }
}
async function startServer() {
    try {
        await setupVite();
        const server = await (0, routes_1.registerRoutes)(app);
        server.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`Lodge Management Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Access the application at: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();

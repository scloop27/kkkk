import express from "express";
import { registerRoutes } from "./routes";
import dotenv from "dotenv";
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: './client',
    });
    
    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }
}

async function startServer() {
  try {
    await setupVite();
    const server = await registerRoutes(app);
    
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Lodge Management Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Access the application at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
#!/usr/bin/env node

// Simple startup script for the lodge management server
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Lodge Management Platform...');

const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3000'
  }
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting server...');
    setTimeout(() => {
      process.exit(1); // Exit so it can be restarted
    }, 1000);
  }
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  serverProcess.kill('SIGINT');
});
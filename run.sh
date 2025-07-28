#!/bin/bash
export NODE_ENV=development
export PORT=3000
cd /home/runner/workspace
exec npx tsx server/index.ts
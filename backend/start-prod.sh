#!/bin/bash

# Exit immediately if any command fails, or if an uninitialized variable is used
set -euo pipefail

echo "[Production Startup] Starting Redis server..."
# Start redis-server in the background on port 6379, daemonized
redis-server --daemonize yes --port 6379

echo "[Production Startup] Redis server started successfully."

# Override Redis host and port for internal loopback connection since they run on the same container
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379

echo "[Production Startup] Starting Express API..."
# Start the Express server in the background and save its PID
bun run start &
API_PID=$!

echo "[Production Startup] Starting BullMQ Worker..."
# Start the BullMQ worker in the background and save its PID
bun run worker &
WORKER_PID=$!

echo "[Production Startup] Services are active. Watching processes..."

# Wait for both processes to finish
# If any process exits, kill the other one and exit with its code
wait -n

echo "[Production Startup] One of the backend services exited. Shutting down container..."
kill $API_PID $WORKER_PID 2>/dev/null || true
exit 1

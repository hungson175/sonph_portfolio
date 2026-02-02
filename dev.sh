#!/bin/bash
# Start dev servers (backend + frontend)
set -e

echo "=== Stopping prod services if running ==="
systemctl --user stop portfolio-frontend 2>/dev/null || true
systemctl --user stop portfolio-backend 2>/dev/null || true
sleep 1
fuser -k 3336/tcp 2>/dev/null || true
fuser -k 17064/tcp 2>/dev/null || true
sleep 1

echo "=== Starting backend on port 17064 ==="
cd /home/hungson175/dev/SonPH/my-portfolio/backend
uvicorn app.main:app --host 0.0.0.0 --port 17064 --reload &
BACKEND_PID=$!
sleep 2

echo "=== Starting frontend dev server on port 3336 ==="
cd /home/hungson175/dev/SonPH/my-portfolio/frontend
npm run dev

# When frontend exits, kill backend too
kill $BACKEND_PID 2>/dev/null || true

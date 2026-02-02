#!/bin/bash
# Build and start production servers via systemd
set -e

APP_DIR="/home/hungson175/dev/SonPH/my-portfolio/frontend"

echo "=== Stopping dev/prod servers ==="
systemctl --user stop portfolio-frontend 2>/dev/null || true
systemctl --user stop portfolio-backend 2>/dev/null || true
sleep 1
fuser -k 3336/tcp 2>/dev/null || true
fuser -k 17064/tcp 2>/dev/null || true
sleep 1

echo "=== Cleaning cache & rebuilding frontend ==="
rm -rf "$APP_DIR/.next"
cd "$APP_DIR"
npm run build

echo "=== Starting backend service ==="
systemctl --user start portfolio-backend
sleep 2

if systemctl --user is-active --quiet portfolio-backend; then
  echo "=== Backend running on port 17064 ==="
else
  echo "=== ERROR: Backend failed to start ==="
  journalctl --user -u portfolio-backend --no-pager -n 20
  exit 1
fi

echo "=== Starting frontend service ==="
systemctl --user start portfolio-frontend
sleep 3

if systemctl --user is-active --quiet portfolio-frontend; then
  echo "=== Frontend running on port 3336 ==="
  echo "=== https://portfolio.hungson175.com is live ==="
else
  echo "=== ERROR: Frontend failed to start ==="
  journalctl --user -u portfolio-frontend --no-pager -n 20
  exit 1
fi

#!/bin/bash
# scripts/deploy.sh
# Idempotent deployment script — safe to run multiple times
# Runs on EC2 server, called by GitHub Actions via SSH
set -e

APP_DIR="/home/ubuntu/rawmart"
APP_NAME="rawmart"
NODE_ENV="production"

echo "🚀 Starting RawMart deployment — $(date)"

# Ensure app directory exists (idempotent)
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Pull latest code from GitHub
echo "📥 Pulling latest code..."
git fetch origin main
git reset --hard origin/main  # Hard reset = idempotent, same result every run

# Install/update backend dependencies (ci = reproducible from lockfile)
echo "📦 Installing backend dependencies..."
cd backend-ts
npm ci --omit=dev

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run build

cd ..

# Ensure PM2 is installed (idempotent check)
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
fi

# Start or restart app with PM2
# This is idempotent: works whether app is running or not
echo "♻️  Restarting application..."
pm2 describe "$APP_NAME" > /dev/null 2>&1 \
  && pm2 restart "$APP_NAME" \
  || pm2 start "$APP_DIR/backend-ts/dist/app.js" \
       --name "$APP_NAME" \
       --env production \
       --log "$APP_DIR/logs/app.log"

# Save PM2 process list so it survives server reboots
pm2 save

echo ""
echo "✅ Deployment complete — $(date)"
pm2 status "$APP_NAME"
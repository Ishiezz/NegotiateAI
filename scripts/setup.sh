#!/bin/bash
# scripts/setup.sh
# Idempotent dev environment setup
# Safe to run multiple times — won't break if already done
set -e  # Exit on any error

echo "🔧 Setting up RawMart development environment..."

# Create directories (mkdir -p = idempotent, no error if exists)
mkdir -p backend-ts/dist
mkdir -p frontend/build
mkdir -p logs

# Copy env files only if they don't already exist
if [ ! -f "backend-ts/.env" ]; then
  cp backend-ts/.env.example backend-ts/.env
  echo "✅ Created backend-ts/.env from example"
else
  echo "ℹ️  backend-ts/.env already exists, skipping"
fi

# Install root deps
echo "📦 Installing root dependencies..."
npm install

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend-ts
npm install
cd ..

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install PM2 globally only if not already installed (idempotent)
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2 globally..."
  npm install -g pm2
else
  echo "ℹ️  PM2 already installed: $(pm2 --version)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit backend-ts/.env with your MongoDB URI"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:3000"
#!/bin/bash
# Start script for CHARAK API system

echo "🚀 Starting CHARAK API System..."
echo ""

# Start API server in background
echo "📡 Starting API Server on port 3001..."
npx tsx server.ts &
API_PID=$!

# Wait for API to be ready
sleep 3

# Start frontend dev server
echo "🌐 Starting Frontend on port 5173..."
npm run dev

# Cleanup on exit
trap "kill $API_PID" EXIT

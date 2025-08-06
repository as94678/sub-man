#!/bin/bash

echo "Starting deployment process..."

# 運行 Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# 啟動應用程式
echo "Starting application..."
node server.js
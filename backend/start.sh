#!/bin/bash

echo "Starting deployment process..."

# 運行 Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# 生成 Prisma client (預防措施)
echo "Generating Prisma client..."
npx prisma generate

# 啟動應用程式
echo "Starting application..."
node server.js
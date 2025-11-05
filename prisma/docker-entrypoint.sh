#!/usr/bin/env bash
set -e

# Ensure prisma client exists (idempotent)
echo "[entrypoint] prisma generate"
bunx prisma generate

# Apply migrations
echo "[entrypoint] prisma migrate deploy"
bunx prisma migrate deploy

# Start server
echo "[entrypoint] start bun app on :3001"
exec bun run src/index.ts

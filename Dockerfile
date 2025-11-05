# Bun + Elysia + Prisma
FROM oven/bun:1 AS base
WORKDIR /app

# Install OpenSSL (required by Prisma)
USER root
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
USER bun

# Install dependencies (cache-friendly)
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production

# Copy Prisma schema and migrations first
COPY prisma ./prisma

# Copy application source
COPY tsconfig.json ./
COPY src ./src

# Ensure public uploads exists (mounted as volume at runtime)
RUN mkdir -p public/uploads

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 3001

# Entrypoint: run migrations then start server
COPY prisma/docker-entrypoint.sh ./prisma/docker-entrypoint.sh
RUN chmod +x ./prisma/docker-entrypoint.sh

CMD ["./prisma/docker-entrypoint.sh"]

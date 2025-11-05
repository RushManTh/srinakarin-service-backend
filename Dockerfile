# Bun + Elysia + Prisma
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (cache-friendly)
COPY package.json ./
COPY bun.lockb ./
RUN bun install --ci

# Copy Prisma schema and migrations first
COPY prisma ./prisma

# Copy application source
COPY tsconfig.json ./
COPY src ./src

# Ensure public uploads exists (mounted as volume at runtime)
RUN mkdir -p public/uploads

# Generate Prisma Client
RUN bunx prisma generate

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 3001

# Entrypoint: run migrations then start server
COPY prisma/docker-entrypoint.sh ./prisma/docker-entrypoint.sh
RUN chmod +x ./prisma/docker-entrypoint.sh

CMD ["./prisma/docker-entrypoint.sh"]

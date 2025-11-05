# ---------- Stage 1: Build ----------
FROM oven/bun:1 AS builder
WORKDIR /app

# Install system deps for Prisma
USER root
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
USER bun

# Copy dependency files
COPY package.json bun.lockb ./

# Force install all deps (including devDependencies)
ENV NODE_ENV=development
RUN bun install

# Copy source files
COPY prisma ./prisma
COPY tsconfig.json .
COPY src ./src

# Generate Prisma client (requires dev deps)
RUN bunx prisma generate

# ---------- Stage 2: Runtime ----------
FROM oven/bun:1 AS runtime
WORKDIR /app

# System dependencies
USER root
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
USER bun

# Copy only what is needed for runtime
COPY --from=builder /app ./

# Ensure uploads folder exists
RUN mkdir -p public/uploads

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 3001

# Entrypoint for Prisma migration and app start
COPY prisma/docker-entrypoint.sh ./prisma/docker-entrypoint.sh
RUN chmod +x ./prisma/docker-entrypoint.sh

CMD ["./prisma/docker-entrypoint.sh"]

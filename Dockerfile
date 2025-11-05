FROM oven/bun:1 AS base
WORKDIR /app

# Install OpenSSL (required by Prisma)
USER root
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json bun.lock ./

# Give permission to bun
RUN chown -R bun:bun /app

# Install dependencies as bun user
USER bun
RUN bun install

# Copy Prisma schema and migrations first
COPY prisma ./prisma

# Copy application source
COPY tsconfig.json .
COPY src ./src

# Ensure public/uploads exists
RUN mkdir -p public/uploads

# Runtime configuration
ENV NODE_ENV=production
EXPOSE 3001

# Entrypoint
COPY prisma/docker-entrypoint.sh ./prisma/docker-entrypoint.sh

USER root
RUN chmod +x ./prisma/docker-entrypoint.sh
USER bun

CMD ["./prisma/docker-entrypoint.sh"]
# ---- Build stage ----
FROM node:24.11.1-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client (custom schema path)
RUN npm run prisma:generate

# Build the NestJS app
RUN npm run build

# ---- Runtime stage ----
FROM node:24.11.1-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy package.json so npm can run and expose npm_package_version
COPY --from=builder /usr/src/app/package*.json ./

# Reuse node_modules from builder (includes Prisma client)
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled app and Prisma schema folder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/prisma ./src/prisma

EXPOSE 3000

# Run migrations using the correct schema path, then start via npm
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && npm run start:prod"]

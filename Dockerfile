# ---- Build stage ----
FROM node:24.11.1-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:24.11.1-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled app from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema/migrations if you ever need them in container
COPY src/prisma ./src/prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]

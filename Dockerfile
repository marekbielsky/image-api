# ---- Build stage ----
FROM node:24.11.1-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client (using your custom schema path)
RUN npm run prisma:generate

# Build the NestJS app
RUN npm run build

# ---- Runtime stage ----
FROM node:24.11.1-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Reuse node_modules from builder (includes generated Prisma client)
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled app and Prisma schema
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/prisma ./src/prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]

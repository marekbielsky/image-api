# ---- Build stage ----
FROM node:24.11.1-alpine AS builder

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client (custom schema path)
RUN npm run prisma:generate

# Build the NestJS app
RUN npm run build


# ---- Runtime stage ----
FROM node:24.11.1-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# --- Security: use non-root user ---
# node user is pre-defined in the Node image (UID 1000)
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
USER node

# Copy package metadata so npm commands work and npm_package_version is available
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./

# Copy node_modules from builder (includes Prisma client)
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

# Copy compiled app and Prisma schema folder
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/src/prisma ./src/prisma

EXPOSE 3000

# --- Run migrations + start app ---
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && npm run start:prod"]

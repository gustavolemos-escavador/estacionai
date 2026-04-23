# Single-stage: devDependencies must stay because 'prisma' CLI is a devDep
# and is required at runtime for 'prisma migrate deploy'.
FROM node:20-alpine

# Prisma requires OpenSSL at both build and runtime.
# Alpine does not ship it by default.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Install all deps (including devDeps for prisma CLI)
RUN npm ci

# Generate Prisma client targeting the current platform
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

EXPOSE 3001

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# ---- builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
# next is a dependency (not devDep), so --omit=dev is safe here
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
# next.config.ts and tsconfig.json are required by 'next start'
COPY next.config.ts tsconfig.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]

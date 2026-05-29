# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY server ./server
COPY public ./public
COPY .env.example ./.env.example

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server/index.js"]

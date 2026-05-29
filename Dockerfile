# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN npm ci --no-audit --no-fund

FROM deps AS build
COPY tsconfig.server.json tsconfig.client.json ./
COPY src ./src
COPY public ./public
COPY tests ./tests
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY --from=build /app/dist ./dist
COPY public ./public
RUN npm prune --omit=dev

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "dist/src/server/index.js"]

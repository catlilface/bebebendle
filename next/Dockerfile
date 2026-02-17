FROM oven/bun:latest AS base

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:latest AS production

WORKDIR /app

COPY drizzle.config.ts /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/db ./db

RUN mkdir -p /app/db

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["sh", "-c", "bunx drizzle-kit migrate && bunx drizzle-kit push && bun run start"]

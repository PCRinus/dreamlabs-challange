FROM node:20.15.1 AS development
RUN apt-get update && apt-get install -y openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install
COPY . .

FROM node:20.15.1-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/prisma ./prisma

COPY . .
RUN pnpm run build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM node:20.15.1-alpine AS production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

CMD ["node", "dist/src/main.js"]

# FROM base AS deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm dlx prisma generate
# RUN pnpm run build

# FROM base
# COPY --from=deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 3333
# CMD ["pnpm", "run", "start:migrate:prod"]
FROM node:20.15.1-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . ./

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm dlx prisma generate
RUN pnpm run build

FROM base
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3333
CMD ["pnpm", "run", "start:migrate:prod"]
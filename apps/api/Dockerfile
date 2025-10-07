FROM node:22-alpine AS builder

WORKDIR /app
COPY apps/api/dist/package.json apps/api/dist/package-lock.json ./

# Install only Prisma dependencies
RUN npm ci --only=production

RUN npm cache clean --force
RUN rm -rf /tmp/*

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

RUN addgroup --system api && \
  adduser --system -G api api

# Copy built application (webpack bundles everything)
COPY apps/api/dist api/
COPY libs/prisma/src api/prisma
COPY apps/api/startup.sh .

# Copy only necessary node_modules
COPY --from=builder /app/node_modules /app/api/node_modules

RUN npx prisma generate --schema api/prisma/schema.prisma

RUN chmod +x startup.sh
COPY .env .

EXPOSE 3100

ENTRYPOINT [ "./startup.sh" ]

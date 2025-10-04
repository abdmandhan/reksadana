FROM node:22-alpine AS builder
WORKDIR /app

# Copy workspace files
COPY package.json package-lock.json ./
COPY libs/prisma/package.json libs/prisma/

# Install only Prisma dependencies
RUN npm ci --only=production

# Copy Prisma source and generate client
COPY libs/prisma/src libs/prisma/src
WORKDIR /app/libs/prisma
RUN npm run generate

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

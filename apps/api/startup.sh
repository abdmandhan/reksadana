#!/bin/sh

npx prisma migrate deploy --schema api/prisma/schema.prisma
node api/main.js

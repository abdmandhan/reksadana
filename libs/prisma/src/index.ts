import { PrismaClient } from '@prisma/client';
import { PrismaModule } from "./prisma.module.js"
import { PrismaService } from './prisma.service.js';

const prisma = new PrismaClient();

export { PrismaModule, PrismaService };

export default prisma;

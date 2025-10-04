import { Injectable } from '@nestjs/common';
import prisma from '@reksadana/prisma';

@Injectable()
export class AppService {
  async getData() {
    try {
      // Test Prisma connection
      await prisma.$connect();
      return {
        message: 'Hello API with Prisma!',
        prismaConnected: true,
        roles: await prisma.roles.findMany()
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        message: 'Hello API (Database not connected)',
        prismaConnected: false
      };
    }
  }
}

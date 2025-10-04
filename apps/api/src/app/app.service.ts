import { Injectable } from '@nestjs/common';
// import prisma from "@/libs/prisma"
// import prisma from "../../../../libs/prisma/src"

@Injectable()
export class AppService {
  getData(): { message: string } {
    return ({ message: 'Hello API' });
  }
}

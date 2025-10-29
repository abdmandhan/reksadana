import { Injectable } from "@nestjs/common";
import { LoginDTO } from "./dto";
// import { PrismaService } from "@reksadana/prisma";


@Injectable()
export class AuthService {
  constructor(
    // prismaService: PrismaService
  ) { }

  async login(data: LoginDTO) {
    return {
      message: 'Login successful',
      data: data
    }
  }

}


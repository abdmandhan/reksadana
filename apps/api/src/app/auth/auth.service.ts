import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "./dto";
import { PrismaService } from "@reksadana/prisma";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login({ username, password }: LoginDTO) {
    const findUser = await this.prisma.users.findFirst({ where: { username } })
    if (!findUser) {
      throw new UnauthorizedException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }

    return {
      access_token: this.jwtService.sign({ userId: findUser.id }),
      user: findUser
    }
  }

}


import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { PrismaModule } from "@reksadana/prisma";
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expireIn') },
      }),
      inject: [ConfigService],
    }),
    PrismaModule
  ]

})
export class AuthModule { }

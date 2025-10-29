import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configurations } from '../configurations';
import { AuthModule } from './auth/auth.module';
// import { PrismaModule } from '@reksadana/prisma'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),
    AuthModule,
    // PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

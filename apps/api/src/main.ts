/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.API_PORT || 3400;
//   await app.listen(port);
//   Logger.log(`🚀 Application is running asdfasdf on: http://localhost:${port}/${globalPrefix}`);
// }

// bootstrap();

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// import { SohighExceptionFilter } from './app/exception.filter';
// import { logger } from './app/middlewares';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get<ConfigService>(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // app.useGlobalFilters(new SohighExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.setGlobalPrefix('api');
  // app.use(logger);
  app.enableCors({
    origin: ['*',],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Qiblat URS API')
    .setDescription('Qiblat URS API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // this
    },
  });

  const port = configService.get('app.port')

  Logger.log(`Server running on ${port}`);

  await app.listen(port);
}

bootstrap();

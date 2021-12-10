import { fastifyPlugin as rTracerPlugin } from 'cls-rtracer';
import { fastifyHelmet as helmetPlugin } from 'fastify-helmet';
import multipartPlugin from 'fastify-multipart';
import hexoid from 'hexoid';

import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerService } from './core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: process.env.NODE_ENV === 'development' },
  );

  const loggerService = await app.resolve(LoggerService);
  app.useLogger(loggerService);

  app.enableCors();
  app.register(helmetPlugin, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.register(rTracerPlugin, {
    echoHeader: true,
    requestIdFactory: hexoid(32),
  });
  app.register(multipartPlugin);

  if (process.env.SWAGGER_PATH) {
    const config = new DocumentBuilder()
      .setTitle(process.env.APP_NAME)
      // .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
  }

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

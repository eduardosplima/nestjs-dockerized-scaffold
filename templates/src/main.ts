import helmetPlugin from '@fastify/helmet';
import multipartPlugin from '@fastify/multipart';
import { fastifyPlugin as rTracerPlugin } from 'cls-rtracer';
import hexoid from 'hexoid';

import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { CoreLogger } from './core/logger/core-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true, logger: new CoreLogger() },
  );

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
    const builder = new DocumentBuilder()
      // .addBearerAuth()
      .setTitle(process.env.APP_NAME);
    if (process.env.SWAGGER_SERVER) {
      builder.addServer(process.env.SWAGGER_SERVER);
    }
    const config = builder.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
  }

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

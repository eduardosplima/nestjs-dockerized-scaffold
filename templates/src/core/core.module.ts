import { ValidationPipe } from '@nestjs/common';
import type { DynamicModule, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ExceptionFilter } from '../commom/filters/exception.filter';
import { HttpLoggerInterceptorDEV } from '../commom/interceptors/http-logger-dev.interceptor';

// import { DbModule } from './db/db.module';
// import { EmailModule } from './email/email.module';
// import { LdapModule } from './ldap/ldap.module';
// import { MetricsModule } from './metrics/metrics.module';
// import { MongodbModule } from './mongodb/mongodb.module';
// import { RedisModule } from './redis/redis.module';

export class CoreModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_PIPE,
        useFactory: () =>
          new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
          }),
      },
      {
        provide: APP_FILTER,
        useClass: ExceptionFilter,
      },
    ];

    if (process.env.HTTP_LOGGER_DEV === 'true') {
      providers.push({
        provide: APP_INTERCEPTOR,
        useClass: HttpLoggerInterceptorDEV,
      });
    }

    return {
      module: CoreModule,
      imports: [
        // DbModule,
        // MongodbModule,
        // LdapModule,
        // RedisModule,
        // EmailModule,
        // MetricsModule,
      ],
      providers,
    };
  }
}

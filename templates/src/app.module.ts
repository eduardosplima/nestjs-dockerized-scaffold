import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreModule } from './core/core.module';

// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
    }),
    CoreModule.forRoot(),

    // AuthModule,
  ],
})
export class AppModule {}

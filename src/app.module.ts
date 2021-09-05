import { ConsoleModule } from 'nestjs-console';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AppService } from './app.service';
import { CommandHandlers } from './commands/handlers';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CqrsModule,

    ConsoleModule,
  ],
  providers: [...CommandHandlers, AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
import { SlacksModule } from './slacks/slacks.module';
import { CronController } from './cron/cron.controller';
import { CronModule } from './cron/cron.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.stage.dev'],
      // validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    SlacksModule,
    CronModule,
    HttpModule,
  ],
  controllers: [AppController, CronController],
  providers: [AppService, CronService],
})
export class AppModule {}

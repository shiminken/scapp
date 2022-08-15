import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlacksModule } from 'src/slacks/slacks.module';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';

@Module({
  imports: [ConfigModule, HttpModule, SlacksModule],
  exports: [CronService],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}

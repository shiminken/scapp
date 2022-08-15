import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SlacksService } from './slacks.service';
import { SlacksController } from './slacks.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [SlacksService],
  providers: [SlacksService],
  controllers: [SlacksController],
})
export class SlacksModule {}

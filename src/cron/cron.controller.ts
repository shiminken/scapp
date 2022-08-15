import { Controller, Post } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('schedule')
  async scheduleCron() {
    this.cronService.handleScheduleCron();
  }
}

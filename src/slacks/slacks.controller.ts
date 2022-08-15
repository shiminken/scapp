import { Controller, Get, Post } from '@nestjs/common';
import { SlacksService } from './slacks.service';

@Controller('slacks')
export class SlacksController {
  constructor(private slackService: SlacksService) {}

  @Get('/daily')
  getAllDailyMess() {
    return this.slackService.getDailyHistory();
  }

  @Get('/members')
  getAllMemberInDailyChannel() {
    return this.slackService.getMembers();
  }

  @Post('/fire')
  fireMessageToSlack() {
    return this.slackService.sendMessageToSlack();
  }
}

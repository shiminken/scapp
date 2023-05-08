import { Controller, Get, Post, Query } from '@nestjs/common';
import { SlacksService } from './slacks.service';

@Controller('slacks')
export class SlacksController {
  constructor(private slackService: SlacksService) {}

  @Get('/daily')
  getAllDailyMess(
    @Query('oldest') oldest: string,
    @Query('latest') latest: string,
  ) {
    return this.slackService.getDailyHistory(oldest, latest);
  }

  @Get('/members')
  getAllMemberInDailyChannel() {
    return this.slackService.getMembers();
  }

  @Get('/missing-members')
  getMissingMember(
    @Query('oldest') oldest: string,
    @Query('latest') latest: string,
  ) {
    return this.slackService.getMissingMemberInDailyChannel(oldest, latest);
  }

  @Post('/fire')
  fireMessageToSlack() {
    return this.slackService.sendMessageToSlack();
  }
}

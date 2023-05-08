import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { forkJoin } from 'rxjs';
import { SlacksService } from 'src/slacks/slacks.service';
import _ from 'underscore';

@Injectable()
export class CronService {
  constructor(private readonly slackService: SlacksService) {}

  private readonly logger = new Logger(CronService.name);

  // @Cron('0 45 16 * * 1-5')
  // @Cron('*/10 * * * * *')
  runEvery10Seconds() {
    console.log('Every 1 seconds');
    this.slackService.getDailyHistory().subscribe((r1) => {
      this.slackService.getMembers().subscribe((r2) => {
        // @ts-ignore
        const dailiedMember = r1.data?.messages?.map((item) => item.user);
        // @ts-ignore
        const allMembers = r2.data?.members;
        const remainingMembers = _.difference(allMembers, dailiedMember).filter(
          (item) =>
            item !== 'U029XEDRD6Z' &&
            item !== 'U02A0U0T6KV' &&
            item !== 'U03RJ8703L3' &&
            item !== 'U03HRQY4L8K',
        );

        const memberNameInfos = [];
        remainingMembers?.map((item) => {
          if (item !== undefined && typeof item === 'string') {
            forkJoin([this.slackService.getMemberInfos(item)]).subscribe(
              (response) => {
                response.forEach((eachRes) => {
                  // @ts-ignore
                  memberNameInfos.push(eachRes.data?.user?.real_name);
                });
              },
              (err) => {
                console.log('ERR', err);
              },

              () => {
                if (memberNameInfos?.length === remainingMembers?.length) {
                  let content = '';

                  if (memberNameInfos?.length > 1) {
                    content = `[DAILY CHANNEL REPORT]: There are ${
                      remainingMembers?.length
                    } members haven't daily yet. They are: ${memberNameInfos
                      .join(', ')
                      .toString()}`;
                  } else if (memberNameInfos?.length === 1) {
                    content = `[DAILY CHANNEL REPORT]: There are ${
                      remainingMembers?.length
                    } member hasn't daily yet: ${memberNameInfos
                      .join(', ')
                      .toString()}`;
                  } else if (remainingMembers?.length === 0) {
                    content =
                      'I have nothing todo today. Have a nice weekend guys';
                  }
                  this.slackService.sendMessageToSlack(content).subscribe();
                }
              },
            );
          }
        });
      });
    });
  }

  // @Cron('*/10 * * * * *')
  handleScheduleCron() {
    // const job = new CronJob('*/10 * * * * *', () => {
    //   this.logger.debug('Called every 20 seconds');
    //   return this.slackService.sendMessageToSlack();
    // });
    // this.schedulerRegistry.addCronJob(`${Date.now()}`, job);
    // job.start();
  }
}

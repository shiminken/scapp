import { AxiosResponse } from './../../node_modules/axios/index.d';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import _ from 'underscore';

@Injectable()
export class SlacksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getDailyHistory(
    oldest?: string,
    latest?: string,
  ): Observable<AxiosResponse<[]>> {
    const channelID = this.configService.get<string>(
      'DAILY_MESSAGE_CHANNEL_ID',
    );
    const slackBearerToken =
      this.configService.get<string>('SLACK_BEARER_TOKEN');

    return this.httpService
      .get(
        `https://slack.com/api/conversations.history?channel=${channelID}&oldest=${oldest}&latest=${latest}`,
        {
          headers: {
            Authorization: `Bearer ${slackBearerToken}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }

  getMembers(): Observable<AxiosResponse<[]>> {
    return this.httpService
      .get(
        `https://slack.com/api/conversations.members?channel=${this.configService.get(
          'DAILY_MESSAGE_CHANNEL_ID',
        )}&pretty=1`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'SLACK_BEARER_TOKEN',
            )}`,
          },
        },
      )
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }

  getMemberInfos(userId: string): Observable<string[]> {
    return this.httpService
      .get(`https://slack.com/api/users.info?user=${userId}&pretty=1`, {
        headers: {
          Authorization: `Bearer ${this.configService.get(
            'SLACK_BEARER_TOKEN',
          )}`,
        },
      })
      .pipe(
        map((response) => {
          const members: string[] = response.data.user;
          return members;
        }),
      );
  }

  sendMessageToSlack(content?: string) {
    const data = JSON.stringify({
      text: content,
    });
    const dailyChannel = `https://hooks.slack.com/services/${this.configService.get(
      'DAIlLY_HOOKS_CHANNEL',
    )}`;
    const managementChanel = `https://hooks.slack.com/services/${this.configService.get(
      'MANAGEMENT_HOOKS_CHANNEL',
    )}`;

    return this.httpService.post(managementChanel, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getMissingMemberInDailyChannel(
    oldest?: string,
    latest?: string,
  ): Promise<any> {
    try {
      const [dailyHistory, members] = await Promise.all([
        this.getDailyHistory(oldest, latest).toPromise(),
        this.getMembers().toPromise(),
      ]);

      // Extract member ids from dailyHistory
      //@ts-ignore
      const dailiedMemberIds =
        //@ts-ignore
        dailyHistory?.messages?.map((item) => item.user) || [];

      // Get members who are not in the dailyHistory based on dailiedMemberIds

      //@ts-ignore
      const filteredMembers = members?.members?.filter(
        (item) =>
          item !== 'U029XEDRD6Z' &&
          item !== 'U02A0U0T6KV' &&
          item !== 'U03RJ8703L3' &&
          item !== 'U03UE98TS3W',
      );

      const remainingMembers = _.difference(
        //@ts-ignore
        filteredMembers,
        dailiedMemberIds,
      );
      // Get member info for missing members
      const missingMemberInfo = await Promise.all(
        remainingMembers.map((memberId) =>
          this.getMemberInfos(memberId).toPromise(),
        ),
      );

      const missingMembers = missingMemberInfo.map((info) => {
        return {
          id: info?.id,
          name: info?.real_name,
        };
      });

      return {
        missingMembers:
          missingMembers?.length === filteredMembers?.length
            ? []
            : missingMembers,
        missingMemCount: missingMembers.length,
      };
    } catch (error) {
      console.error('Error while fetching missing members:', error);
      return [];
    }
  }
}

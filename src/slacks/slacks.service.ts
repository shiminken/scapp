import { AxiosResponse } from './../../node_modules/axios/index.d';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

const input = '06:00';
const today = new Date();
today.setHours(...(input.split(':').map(Number) as [number, number]));

const todayTimeStamp = dayjs(today).unix();

@Injectable()
export class SlacksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getDailyHistory(): Observable<AxiosResponse<[]>> {
    return this.httpService
      .get(
        `https://slack.com/api/conversations.history?channel=${this.configService.get(
          'DAILY_MESSAGE_CHANNEL_ID',
        )}&oldest=${todayTimeStamp}&pretty=1`,
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
          return response;
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
          return response;
        }),
      );
  }

  getMemberInfos(userId: string): Observable<AxiosResponse<[]>> {
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
          return response;
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
}

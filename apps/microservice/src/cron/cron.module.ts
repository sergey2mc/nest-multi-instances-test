import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { RedisOptions } from 'ioredis';

import { CRON_JOBS_MANAGER, getRedisOptions } from '@app/configs';

import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      name: CRON_JOBS_MANAGER,
      useFactory: (config: ConfigService) => {
        return {
          redis: getRedisOptions(config) as RedisOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}

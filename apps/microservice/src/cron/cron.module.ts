import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { getRedisOptions } from '../redis';

import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      name: 'jobsManager',
      useFactory: (config: ConfigService) => getRedisOptions(config),
      inject: [ConfigService],
    }),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}

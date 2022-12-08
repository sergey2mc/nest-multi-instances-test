import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RedisOptions } from 'ioredis';

import { CRON_JOBS_MANAGER, getRedisOptions } from '@app/configs';

import { CronProcessor } from './cron-processor';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'JobManagerService',
        useFactory: (config: ConfigService) => {
          return {
            transport: Transport.REDIS,
            options: getRedisOptions(config),
          };
        },
        inject: [ConfigService],
      },
    ]),
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
  providers: [CronProcessor],
})
export class CronModule {}

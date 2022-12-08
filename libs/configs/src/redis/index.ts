import { ConfigService } from '@nestjs/config';
import { RedisOptions } from '@nestjs/microservices';

import * as fs from 'fs';
import * as path from 'path';

export function getRedisOptions(configService: ConfigService): RedisOptions['options'] {
  const options = {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    username: configService.get('REDIS_USER'),
    password: configService.get('REDIS_PASSWORD'),
    db: configService.get('REDIS_DB_INDEX'),
    retryAttempts: 20,
    retryDelay: 3000,
    reconnectOnError: (error: Error) => {
      console.log(error);
      return true;
    },
  };

  return {
    ...(options.password && {
      tls: {
        ...options,
        key: fs.readFileSync(path.join(path.resolve(), './cert/redis-key.key'), 'ascii'),
        cert: fs.readFileSync(path.join(path.resolve(), './cert/redis-cert.crt'), 'ascii'),
        ca: fs.readFileSync(path.join(path.resolve(), './cert/entrust_2048_ca.cer'), 'ascii'),
      }
    }),
    ...options,
  };
}

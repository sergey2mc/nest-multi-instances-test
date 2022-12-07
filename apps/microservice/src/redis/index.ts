import { ConfigService } from '@nestjs/config';
import { RedisOptions } from '@nestjs/microservices';

export function getRedisOptions(configService: ConfigService): RedisOptions['options'] {
  const options = {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
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
    ...(options.password && { tls: options }),
    ...options,
  };
}

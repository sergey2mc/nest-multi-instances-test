import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(ConfigModule);
  const configService = configModule.get(ConfigService);

  const redisOptions: any = {
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

  const app = await NestFactory.createMicroservice<RedisOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        ...(redisOptions.password && { tls: redisOptions }),
        ...redisOptions,
      },
    },
  );

  await app.listen();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { getRedisOptions } from '@app/configs';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(ConfigModule);
  const configService = configModule.get(ConfigService);

  const app = await NestFactory.createMicroservice<RedisOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: getRedisOptions(configService),
    },
  );

  await app.listen();
}
bootstrap();

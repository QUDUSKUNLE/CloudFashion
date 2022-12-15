import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

(async () => {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 1 }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      stopAtFirstError: true,
      validationError: {
        value: true,
      },
    }),
  );
  await app.listen(configService.get('PORT'));
  Logger.log(`CloudCloths running on port ${await app.getUrl()}`);
})();

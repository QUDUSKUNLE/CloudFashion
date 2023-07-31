import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
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
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      validationError: {
        value: true,
      },
    }),
  );
  await app.listen(configService.get('PORT'));
  Logger.log(`CloudCloths running on port ${await app.getUrl()}`);
})();

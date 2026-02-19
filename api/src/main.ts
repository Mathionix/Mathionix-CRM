import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const bootstrap = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
  return app;
};

// Check if we're running locally or on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  bootstrap(server).then(async () => {
    await server.listen(process.env.PORT ?? 3001);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  });
}

export default server;

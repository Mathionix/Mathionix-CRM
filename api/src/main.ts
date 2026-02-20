import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import serverless from 'serverless-http';

let cachedServer: any;

export const bootstrap = async () => {
  const expressInstance = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins for testing
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  await app.init();
  return serverless(expressInstance);
};

// Vercel Serverless Handler
export default async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
};

// Local Development
if (!process.env.VERCEL) {
  const server = express();
  NestFactory.create(AppModule, new ExpressAdapter(server)).then(async (app) => {
    app.enableCors();
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

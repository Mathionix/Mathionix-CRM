import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';

let cachedServer: Express;

export const bootstrap = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
  return app;
};

// Vercel Serverless Handler
export default async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = express();
    await bootstrap(cachedServer);
  }
  return cachedServer(req, res);
};

// Local Development
if (!process.env.VERCEL) {
  const server = express();
  bootstrap(server).then(() => {
    const port = process.env.PORT ?? 3001;
    server.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  });
}

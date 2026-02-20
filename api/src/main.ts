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

  // Explicit CORS configuration for Vercel Hobby
  app.enableCors({
    origin: true, // Reflects the request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  await app.init();
  return app;
};

// Vercel Serverless Handler
export default async (req: any, res: any) => {
  // Handle basic CORS preflight manually if needed at handler level
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }

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

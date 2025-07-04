import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 5000;
  // const frontendUrl = config.get<string>('FRONTEND_URL') || '*';
  // const frontendUrl = 'https://kuwait-zip-legacy-projectors.trycloudflare.com/'

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();

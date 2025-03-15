import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // ✅ Load environment variables from .env file

  const app = await NestFactory.create(AppModule);

  app.enableCors(); // ✅ Enable CORS if needed for frontend requests

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();

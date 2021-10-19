import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 9000;
  await app.listen(port).then(() => console.info(`API starts at port ${port}`));
}
bootstrap();

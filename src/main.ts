// if (!process.env.IS_TS_NODE) {
//   require('module-alias/register');
// }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3005, () => {
    console.log('App listening on port 3005');
  });
}
bootstrap();

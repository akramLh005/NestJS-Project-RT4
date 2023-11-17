import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  function generateToken(userId:number,secretKey:string): string {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    return token;
  }
}
bootstrap();

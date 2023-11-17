import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { v4 as uuidv4 } from 'uuid';
import { TestModule } from './test/test.module';
import { TodoModule } from './todo/todo.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from '@nestjs/typeorm';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';

@Module({
  imports: [
    CommonModule,
    TestModule,
    TodoModule,
    UserModule,
    CvModule,
    SkillModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    CvModule,
    UserModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'UUID',
      useValue: uuidv4,
    },
  ],
  exports: ['UUID'],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(HelmetMiddleware)
      .forRoutes('todo')
      .apply(AuthMiddleware)
      .forRoutes(
          { path: 'todo/add', method: RequestMethod.POST },
        { path: 'todo/delete*', method: RequestMethod.DELETE },
        { path: 'todo/update*', method: RequestMethod.PATCH },
      );
  }

}

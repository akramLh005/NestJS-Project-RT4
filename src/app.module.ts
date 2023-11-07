import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { v4 as uuidv4 } from 'uuid';
import { TestModule } from './test/test.module';
import { TodoModule } from './todo/todo.module';
import { Todo } from "./Entities/Todo.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';

@Module({
  imports: [CommonModule, TestModule, TodoModule,TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'tp1-nest',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  }),],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'UUID',
      useValue: uuidv4,
    }],
  exports: ['UUID'],
})
export class AppModule {



}

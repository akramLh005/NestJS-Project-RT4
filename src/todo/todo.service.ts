import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Todo } from "../entities/todo.entity";
import { AddTodoDto } from "./dto/add-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "./enums/status.enum";
import { ParamsDTO } from "./dto/search-params.dto";
import {CrudService} from "../generics/CrudService";

@Injectable()
export class TodoService extends CrudService<Todo, AddTodoDto,UpdateTodoDto>{
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {
    super(todoRepository);
  }

  async createTodo(newTodo: AddTodoDto, userId: string) {
    const todo = super.create(newTodo);
    (await todo).userId=userId;

  }


  async Paginatedget(
    page: number = 1,
    pageSize: number = 5,): Promise<Todo[]> {

    const skip = (page - 1) * pageSize;
    return this.todoRepository.find({
      skip: skip,
      take: pageSize,
    });
  }


  async findByParams(params: ParamsDTO): Promise<Todo[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    queryBuilder.where('todo.DeletedAt IS NULL');
    if (params.name) {
      queryBuilder.andWhere('todo.name LIKE :name', { name: `%${params.name}%` });
    }
    if (params.description) {
      queryBuilder.andWhere('todo.description LIKE :description', { description: `%${params.description}%` });
    }
    if (params.state) {
      queryBuilder.andWhere('todo.state = :state', { state: params.state });
    }
    return await queryBuilder.getMany();
  }


  async updateTodo(id : number ,newtodo: UpdateTodoDto , userId : string ) {
    let todo = await this.todoRepository.findOne({
      where: {
        id: id,
        userId: userId
      }
    });
    if (todo) {
      todo.status = newtodo.state;
      await this.todoRepository.save(todo);
      return "Todo updated successfully"
    }
    throw new HttpException(
      'Todo not found',
      404
    )
  }


  async softDelete(name: string) {
    let todo = await this.todoRepository.findOne({ where: { name: name } });
    if (todo) {
      await this.todoRepository.softDelete(name);
      return "Todo deleted successfully"
    }
    throw new HttpException(
      'Todo not found',
      404
    )
  }



  async restore(name: string) {
    let todo = await this.todoRepository.findOne({ where: { name: name } });
    let restored;
    if (!todo) {
      restored = await this.todoRepository.restore(name);
      return "Todo Recovered Successfully"
    }
    throw new HttpException(
      'Cant perform this action',
      400
    )
  }


  async countTodosByStatus(): Promise<{ [key: string]: number }> {
    const countByStatus = {};

    countByStatus['PENDING'] = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.status = :status', { status: 'PENDING' })
      .getCount();

    countByStatus['COMPLETED'] = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.status = :status', { status: 'COMPLETED' })
      .getCount();

    countByStatus['CANCELED'] = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.status = :status', { status: 'CANCELED' })
      .getCount();

    return countByStatus;
  }


}
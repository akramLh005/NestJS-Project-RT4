import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { Todo } from "../entities/todo.entity";
import { AddTodoDto } from "./dto/add-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "./enums/status.enum";
import { ParamsDTO } from "./dto/search-params.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) { }

  async create(newtodo: AddTodoDto) {
    let todo = await this.todoRepository.findOne({ where: { name: newtodo.name } });
    if (!todo) {
      todo = new Todo();
      todo.name = newtodo.name;
      todo.description = newtodo.description;
      todo.state = Status.PENDING;
      await this.todoRepository.save(todo);
      return "Todo created successfully"
    }
    throw new HttpException(
      'Todo already exist',
      400
    )
  }


  async findAll(page: number): Promise<Todo[]> {
    let start = (page - 1) * 2;
    let end = start + 2;
    let todos = [];
    todos = await this.todoRepository.find();
    todos = todos.slice(start, end);
    return todos;
  }

  async findOne(name: string): Promise<Todo> {
    let todo = await this.todoRepository.findOne({ where: { name: name } });
    if (todo) {
      return todo;
    }
    throw new HttpException(
      'Todo not found',
      404
    )
  }

  async findByid(id: number): Promise<Todo> {
    const findOneOptions: FindOneOptions = {
      where: { id: id }
    };
    const todo = await this.todoRepository.findOne(findOneOptions);

    if (!todo) {
      throw new NotFoundException(`Le todo avec l'ID ${id} n'a pas été trouvé.`);
    }

    return todo;
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


  async findBy(params: ParamsDTO): Promise<Todo[]> {
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





  async update(newtodo: UpdateTodoDto) {
    let todo = await this.todoRepository.findOne({ where: { name: newtodo.name } });
    if (todo) {
      todo.state = newtodo.state;
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

  async delete(name: string) {
    let todo = await this.todoRepository.findOne({ where: { name: name } });
    if (todo) {
      await this.todoRepository.delete(todo);
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
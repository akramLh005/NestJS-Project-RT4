import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { AddTodoDto } from "./dto/add-todo.dto";
import { TodoService } from "./todo.service";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "../Entities/Todo.entity";


@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  addTodo(
    @Body() todo: AddTodoDto
  ) {
    return this.todoService.create(todo);
  }
  @Get(':id')
  async getTodobyId(@Param('id') id){
    console.log(id)
    return await this.todoService.findByid(id)

  }


  @Patch()
  updateTodo(
    @Body() todo: UpdateTodoDto
  ) {
    return this.todoService.update(todo);
  }

  @Delete('soft-delete/:name')
  softDeleteTodo(
    @Param('name') name: string,
  ) {
    return this.todoService.softDelete(name);
  }

  @Delete('delete/:name')
  hardDeleteTodo(
    @Param('name') name: string,
  ) {
    return this.todoService.delete(name);
  }

  @Get('restore/:name')
  restoreTodo(
    @Param('name') name: string,
  ) {
    return this.todoService.restore(name);
  }

  @Get('/status-counts')
  async countTodoByStatus(): Promise<{ [key: string]: number }> {
    const counts = await this.todoService.countTodosByStatus();

    if (!counts) {
      throw new NotFoundException('Could not find todo counts.');
    }

    return counts;
  }

  @Get('findAllPaginated')
  async PaginatedgetAllTodos(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<Todo[]> {
    return this.todoService.Paginatedget(page, pageSize);
  }














}

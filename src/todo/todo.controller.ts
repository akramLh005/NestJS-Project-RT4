import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { AddTodoDto } from "./dto/add-todo.dto";
import { TodoService } from "./todo.service";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "../Entities/Todo.entity";

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/add')
  addTodo(
    @Body() todo: AddTodoDto,
    @Req() req
  ) {
    const userId = req.userId;
    return this.todoService.createTodo(todo,userId);
  }
  @Get('')
  async getAlltodo(){
    return await this.todoService.findAll();

  }

  @Get(':id')
  async getTodobyId(@Param('id') id){
    return await this.todoService.findOne(id);

  }
  @Get('params')
  async getTodobyParams(
      @Param() params
  ){
    return await this.todoService.findByParams(params);

  }



  @Patch(':id')
  updateTodo(
    @Param('id ') id : number ,
    @Body() todoUpdate: UpdateTodoDto,
    @Req() req
  ) {
    const userId = req['userId'];
    return this.todoService.updateTodo(id,todoUpdate, userId);
  }

  @Delete('soft-delete/:name')
  softDeleteTodo(
    @Param('name') name: string,
  ) {
    return this.todoService.softDelete(name);
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

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if(Object.keys(filterDto)) {
  //         return this.taskService.getTasksWithFilter(filterDto);
  //     } else {
  //         return this.taskService.getAllTasks();
  //     }
  // }

  @Get('/:id')
  getTaskById(@Param('id') id: any): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  // @Delete('/:id')
  // deleteTaskById(@Param('id') id: string): void {
  //     return this.taskService.deleteTaskById(id);
  // }

//   @Post()
//   createTask(@Body() createTaskDto: CreateTaskDto): Task {
//     return this.taskService.createTask(createTaskDto);
//   }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
      return this.taskService.createTask(createTaskDto);
  }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     return this.taskService.createTask(createTaskDto);
  // }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //     @Param('id') id: string,
  //     @Body() updateTaskStatus: UpdateTaskStatusDto
  // ): Task {
  //     const { status } = updateTaskStatus;
  //     return this.taskService.updateTaskStatus(id, status);
  // }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks') 
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
      return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: any, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
      return this.taskService.deleteTaskById(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
      return this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
      @Param('id') id: string,
      @Body() updateTaskStatus: UpdateTaskStatusDto,
      @GetUser() user: User
  ): Promise<Task> {
      const { status } = updateTaskStatus;
      return this.taskService.updateTaskStatus(id, status, user);
  }
}

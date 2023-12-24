import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //     return this.tasks;
  // }

  // getTasksWithFilter(filterDto: GetTasksFilterDto) : Task[] {
  //     const { status, search } = filterDto;
  //     let tasks = this.getAllTasks();

  //     if(status) {
  //         tasks = tasks.filter(task => task.status === status);
  //     }

  //     if(search) {
  //         tasks = tasks.filter(task => {
  //             return task.title.includes(search) || task.description.includes(search);
  //         });
  //     }
  //     return tasks;
  // }

  async getTaskById(id: any): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with "${id}" does not exist!`);
    }
    return found;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if(result.affected === 0) {
        throw new NotFoundException(`Task with "${id}" not found!`); 
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    const res = await this.taskRepository.save(task);
    return res;
  }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //     const task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  // }
}

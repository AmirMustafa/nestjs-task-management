import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import logger from 'src/logger';

@Injectable()
export class TasksService {
  private logger = logger;
  private context = `[TasksService] `;
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    const { status, search } = filterDto;

   query.where({ user:  user.id});

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`${this.context} Failed to get tasks for user ${user.username}, Filters: ${JSON.stringify(filterDto)}, Stack Error: ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: any, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        user
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with "${id}" does not exist!`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with "${id}" not found!`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
    this.logger.info(`${this.context} User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    const res = await this.taskRepository.save(task);
    return res;
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    this.taskRepository.save(task);

    return task;
  }
}

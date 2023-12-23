import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
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

    async getTaskById(id:any): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task with "${id}" does not exist!`);
        }
        return found;
    }

    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id);
    //     let indexToDelete = this.tasks.findIndex(task => task.id === found.id);
    //     if(indexToDelete !== -1) {
    //         this.tasks.splice(indexToDelete, 1);
    //     }
    // }

    // createTask(createTaskDto) {
    //     const { title, description, created_by, updated_by } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //     this.tasks.push(task);
    //     return task;    
    // }

    // updateTaskStatus(id: string, status: TaskStatus) {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}

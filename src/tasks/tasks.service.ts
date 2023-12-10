import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto) : Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if(search) {
            tasks = tasks.filter(task => {
                return task.title.includes(search) || task.description.includes(search);
            });
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);

        if(!found) {
            throw new NotFoundException(`Task with "${id}" does not exist!`);
        }
        return found;
    }

    deleteTaskById(id: string): void {
        const found = this.getTaskById(id);
        let indexToDelete = this.tasks.findIndex(task => task.id === found.id);
        if(indexToDelete !== -1) {
            this.tasks.splice(indexToDelete, 1);
        }
    }

    createTask(createTaskDto) {
        const { title, description, created_by, updated_by } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;    
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}

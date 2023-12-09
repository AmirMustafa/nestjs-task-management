import { Injectable } from '@nestjs/common';
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
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string): void {
        let indexToDelete = this.tasks.findIndex(task => task.id === id);
        if(indexToDelete !== -1) {
            this.tasks.splice(indexToDelete, 1);
        }
    }

    createTask(createTaskDto) {
        const { title, description } = createTaskDto;
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

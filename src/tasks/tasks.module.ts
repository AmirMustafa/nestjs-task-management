import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
// import { TaskRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

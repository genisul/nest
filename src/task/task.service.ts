import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schemas';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}
  create(request: AuthenticatedRequest, createTaskDto: CreateTaskDto) {
    const newTask = new this.taskModel({
      ...createTaskDto,
      isCompleted: false,
      user: request.user._id,
    });
    return newTask.save();
  }

  async findAll() {
    const tasks: Task[] = await this.taskModel.find();
    return tasks;
  }

  async findOne(id: string) {
    const task: Task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      throw new NotFoundException({ message: `${id} task is not existed` });
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.taskModel.findByIdAndUpdate(id, updateTaskDto);
    return { message: `${id} task updated` };
  }

  async remove(id: string) {
    await this.taskModel.findByIdAndDelete(id);
    return { message: `${id} task deleted` };
  }
}

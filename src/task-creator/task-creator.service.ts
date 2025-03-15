import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entity/task.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/entity/user.entity';

@Injectable()
export class TaskCreatorService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async createTask(userId: number, title: string, description: string, payment: number) {
        // Find the user by ID
        const creator = await this.userRepository.findOne({ where: { id: userId } });
        if (!creator) {
            throw new ForbiddenException('User not found');
        }

        // Ensure only TaskCreators can create tasks
        if (creator.role !== UserRole.TaskCreator) {
            throw new ForbiddenException('Only TaskCreators can create tasks');
        }

        // Create the task
        const task = this.taskRepository.create({
            creator,
            title,
            description,
            payment
        });

        return this.taskRepository.save(task);
    }

    // Get all available tasks with creator & executions info
    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find({
            relations: ['creator', 'executions']
        });
    }

    // Get a specific task by ID with creator & executions info
    async getTaskById(taskId: number): Promise <Task> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['creator', 'executions'],
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
        return task;
    }
}

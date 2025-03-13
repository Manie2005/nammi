import { Injectable, ForbiddenException } from '@nestjs/common';
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

    async createTask(userId: number, title: string, description: string, payment: number, executorsRequired: number, verifierRequired: number) {
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
            payment,
            executorsRequired,
            verifierRequired,
        });

        return this.taskRepository.save(task);
    }
}

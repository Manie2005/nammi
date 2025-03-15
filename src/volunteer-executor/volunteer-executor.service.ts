import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from 'src/entity/executor.entity';
import { Task } from 'src/entity/task.entity';
import { User, UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VolunteerExecutorService {
    constructor(
        @InjectRepository(Executor) private readonly executorRepository: Repository<Executor>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async applyTask(taskId: number, userId: number) {
        console.log(`🔍 Fetching task with ID: ${taskId}`);
        console.log(`🔍 Fetching user with ID: ${userId}`);
    
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
    
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        console.log(`✅ User fetched from DB: ID=${user.id}, Role=${user.role}, Wallet=${user.walletAddress}`);
    
        if (user.role !== UserRole.VolunteerExecutor) {
            throw new ForbiddenException('Only Volunteer Executors can execute tasks');
        }

        // Ensure walletAddress is not null
        if (!user.walletAddress) {
            throw new BadRequestException('User must have a wallet address to apply for a task');
        }
    
        // Create and save the executor entry
        const executor = this.executorRepository.create({
            executor: user,
            walletAddress: user.walletAddress, // ✅ Ensures not null
            task: task
        });

        await this.executorRepository.save(executor);
    
        return { message: 'Task Application Successful', executor };
    }
}

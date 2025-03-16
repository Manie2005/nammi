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
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async applyTask(
        taskId: number,
        userId: number,
        description: string,
        payment: number,
    ): Promise<{ message: string; executor: Executor }> {
        console.log(`🔍 Fetching task with ID: ${taskId}`);
        console.log(`🔍 Fetching user with ID: ${userId}`);
    
        // Fetch the task
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
    
        // Fetch the user
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        console.log(`✅ User fetched from DB: ID=${user.id}, Role=${user.role}, Wallet=${user.walletAddress}`);
    
        // Check if the user is a Volunteer Executor
        if (user.role !== UserRole.VolunteerExecutor) {
            throw new ForbiddenException('Only Volunteer Executors can apply for tasks');
        }
    
        // Ensure the user has a wallet address
        if (!user.walletAddress) {
            throw new BadRequestException('User must have a wallet address to apply for a task');
        }
    
        // Check if the user has already applied for this task
        const existingApplication = await this.executorRepository.findOne({
            where: {
                executor: { id: user.id },
                task: { id: taskId },
            },
        });
    
        if (existingApplication) {
            throw new BadRequestException('You have already applied for this task');
        }
    
        // Create and save the executor entry
        const executor = this.executorRepository.create({
            executor: user,
            walletAddress: user.walletAddress, // ✅ Ensures not null
            task: task,
            description: description, // Use the description from the JSON body
            payment: payment, // Use the payment from the JSON body
            status: 'pending', // Default status
        });
    
        await this.executorRepository.save(executor);
    
        return { message: 'Task Application Successful', executor };
    }}
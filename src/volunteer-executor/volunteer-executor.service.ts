import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from 'src/entity/executor.entity';
import { Task } from 'src/entity/task.entity';
import { User,UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VolunteerExecutorService {
    constructor(
        @InjectRepository(Executor) private readonly executorRepository: Repository<Executor>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}
   //find task by ID
    async applyTask(taskId:number,userId:number){
const task =await this.taskRepository.findOne({where:{id:taskId}});
if (!task){
    throw new ForbiddenException('Task not found');
}
//Find the user
const user =await this.userRepository.findOne({where:{id:userId}})
if (!user){
    throw new ForbiddenException('User not found');
}
//Ensure only VolunteerExecutors can execute tasks

if(user.role !== UserRole.VolunteerExecutor){
    throw new ForbiddenException('Only Volunteer Executors can execute tasks')
}
//Create and store executor entry
const executor= await this.executorRepository.create({user,task})
 await this.executorRepository.save(executor);
 return{message: 'Task Application Successful',executor}
    }
}

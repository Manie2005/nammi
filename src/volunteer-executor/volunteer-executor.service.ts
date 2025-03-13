import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from 'src/entity/executor.entity';
import { Task } from 'src/entity/task.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VolunteerExecutorService {
    constructor(
        @InjectRepository(Executor) private readonly executorRepository: Repository<Executor>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}
}

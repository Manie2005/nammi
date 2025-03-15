import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User} from './user.entity';
import { Executor } from './executor.entity';
export enum UserRole {
    TaskCreator = 'TaskCreator',
    VolunteerExecutor = 'VolunteerExecutor',
    VolunteerVerifier = 'VolunteerVerifier',
}
@Entity()

export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string; // Task title

    @Column()
    description: string; // Task Description

    @Column('decimal') // Used Decimal as Float can cause approximation errors
    payment: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // ✅ One Task can be created by one TaskCreator
    @ManyToOne(() => User, (user) => user.createdTasks, { nullable: false })
    creator: User;
    
    @Column({ type: 'varchar', default: 'user' })
    role: string;
    

    // ✅ One Task can have multiple executors (Completed Tasks)
    @OneToMany(() => Executor, (executor) => executor.task)
    executions: Executor[];
    
}

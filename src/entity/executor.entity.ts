import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Executor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    walletAddress: string;

    @Column()
    description: string;

    @Column('decimal') // Used Decimal as Float can cause approximation errors
    payment: number;

    // ✅ Many executors can complete the same task
    @ManyToOne(() => Task, (task) => task.executions, { nullable: false })
    task: Task;

    // ✅ The user who executed the task
    @ManyToOne(() => User, (user) => user.executedTasks, { nullable: false })
    executor: User;

    // ✅ Status of task completion (pending, submitted, verified)
    @Column({ default: 'pending' })
    status: string;

    // ✅ When the executor submits the task
    @Column({ type: 'timestamp', nullable: true })
    submittedAt: Date;

    // ✅ When the task is verified by a verifier
    @Column({ type: 'timestamp', nullable: true })
    verifiedAt: Date;

    // ✅ Verifier who approved the task
    @ManyToOne(() => User, (user) => user.verifiedTasks, { nullable: true })
    verifier: User;
}

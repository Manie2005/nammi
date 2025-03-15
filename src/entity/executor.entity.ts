import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Executor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    walletAddress: string;

    @Column({nullable:true})
    description: string;

    @Column({nullable:true}) // Used Decimal as Float can cause approximation errors
    payment: number;

    // ✅ Many executors can complete the same task
    @ManyToOne(() => Task, (task) => task.executions, { nullable: false })
    @JoinColumn({ name: 'task_id' }) // Explicit foreign key
    task: Task;

    // ✅ The user who executed the task (Renamed to "user" for consistency)
    @ManyToOne(() => User, (user) => user.executedTasks, { nullable: false })
    @JoinColumn({ name: 'executor_id' })
    executor: User;

    // ✅ Status of task completion (pending, submitted, verified)
    @Column({ type: 'enum', enum: ['pending', 'submitted', 'verified'], default: 'pending' })
    status: string;

    // ✅ When the executor submits the task
    @Column({ type: 'timestamp', nullable: true })
    submittedAt: Date;

    // ✅ When the task is verified by a verifier
    @Column({ type: 'timestamp', nullable: true })
    verifiedAt: Date;

    // ✅ Verifier who approved the task
    @ManyToOne(() => User, (user) => user.verifiedTasks, { nullable: true })
    @JoinColumn({ name: 'verifier_id' })
    verifier: User;
}

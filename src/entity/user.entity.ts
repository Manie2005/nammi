import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { Executor } from './executor.entity';

export enum UserRole {
    TaskCreator = 'TaskCreator',
    VolunteerExecutor = 'VolunteerExecutor',
    VolunteerVerifier = 'VolunteerVerifier',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole; // User Role

    @Column({ unique: true })
    walletAddress: string; // Wallet Address

    @Column({ default: 0 })
    balance: number; // $ATOM Balance

    @Column({ nullable: true })
    password: string;

    @Column({ default: null })
    refreshToken?: string;

    @Column({ nullable: true })
    otpCode: string;

    @Column({ nullable: true, type: 'timestamp' })
    otpExpires: Date;

    @Column({ default: false })
    isVerified: boolean;

    // ✅ One TaskCreator can create multiple tasks
    @OneToMany(() => Task, (task) => task.creator)
    createdTasks: Task[];

    // ✅ One Executor (User) can complete multiple tasks
    @OneToMany(() => Executor, (executor) => executor.executor)
    executedTasks: Executor[];

    // ✅ One Verifier (User) can verify multiple completed tasks
    @OneToMany(() => Executor, (executor) => executor.verifier)
    verifiedTasks: Executor[];
}

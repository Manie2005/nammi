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
    role: UserRole;

    @Column({ unique: true })
    walletAddress: string;

    @Column({ default: 0 })
    balance: number;

    @Column({ nullable: true })
    password: string;

    @Column({ default: null })
    refreshToken?: string;

    @Column({ nullable: true })  
    otpCode: string;

    @Column({ nullable: true })
googleId: string;

@Column({ nullable: true })
appleId: string;


    @Column({ nullable: true, type: 'timestamp' })
    otpExpires: Date;

    @Column({ default: false })
    isVerified: boolean;

    @OneToMany(() => Task, (task) => task.creator)
    createdTasks: Task[];

    @OneToMany(() => Executor, (executor) => executor.executor)
    executedTasks: Executor[];

    @OneToMany(() => Executor, (executor) => executor.verifier)
    verifiedTasks: Executor[];
}

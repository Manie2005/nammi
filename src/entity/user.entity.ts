import {Entity,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import { Task } from './task.entity';
export enum UserRole{
    TaskCreator='TaskCreator',
    VolunteerExecutor='VolunteerExecutor',
    VolunteerVerifier='VolunteerVerifier',
}
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({unique:true,nullable:true})
    email:string;
    @Column({type:'enum', enum:UserRole})
    role:UserRole;//Select Role From Above
    @Column({unique:true})
    walletAddress:string;//WalletAddress
    @Column({default:0})
    balance:number;//$ATOM Balance
      @Column({nullable:true})
    password:string;
    @OneToMany(() =>Task,(task)=> task.creator)
    createdTasks:Task[];
    @Column({ default: null })
    refreshToken?: string;
    @Column({nullable:true})
    otpCode:string;
    @Column({nullable:true,type:'timestamp'})
    otpexpires:Date;
    @Column({ default: false })
    isVerified: boolean;
}
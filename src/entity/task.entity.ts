import {Entity,PrimaryGeneratedColumn,Column,ManyToOne} from 'typeorm';
import { User } from './user.entity';
 @Entity()
 export class Task{
@PrimaryGeneratedColumn()
id:number;
@Column()
title:string;//Task title
@Column()
description:string;//Task Description
@Column('decimal')//Used Decimal as Float can cause approximation errors
payment:number;
@Column()
executorsRequired:number;
@Column()
verifierRequired:number;
@Column({type:'timestamp',default:()=>'CURRENT_TIMESTAMP'})
createdAt:Date;
@ManyToOne(()=>User,(user)=>user.createdTasks)//Many Tasks by One Creator
creator:User;





 }
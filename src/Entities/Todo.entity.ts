import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import StatusEnum from './status.enum';
import { BaseEntity } from './base.entity';
import { TimeStampColumns } from "src/generics/timestamp.entities";
import { Status } from "../todo/enums/status.enum";

@Entity('todo')
export class Todo extends TimeStampColumns {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length:50, unique: true})
  name: string;
  @Column()
  description: string;
  @Column()
  status:StatusEnum;
  state: Status;
}

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimeStampColumns } from "../../generics/timestamp.entities";
import {CvEntity} from "../../cv/entities/cv.entity";

@Entity('skill')
export class SkillEntity extends TimeStampColumns{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  designation: string;
  @ManyToMany(() => CvEntity, cv => cv.skills)
  cvs: CvEntity;

}
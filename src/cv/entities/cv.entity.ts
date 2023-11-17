import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from 'typeorm';
import {TimeStampColumns} from "../../generics/timestamp.entities";
import {SkillEntity} from "../../skill/entities/skill.entity";
import {UserEntity} from "../../user/entities/user.entity";



@Entity('cv')
export class CvEntity extends TimeStampColumns{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length:50, unique: true})
  name: string;
  @Column()
  firstname: string;
  @Column()
  age:number;
  @Column()
  cin:string;
  @Column()
  job:string;
  @Column()
  path:string;

  @ManyToMany(() => SkillEntity)
  @JoinTable()
  skills: SkillEntity[];
  @ManyToOne(
    type =>UserEntity,
    (user) => user.cvs,
    {
      cascade: ['insert', 'update'],
      nullable: true
    }
  )
  user: UserEntity;
  userId: any;

}

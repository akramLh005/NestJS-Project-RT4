
import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {UserRoleEnum} from "../../enum/userRole.enum";
import {TimeStampColumns} from "../../generics/timestamp.entities";
import {CvEntity} from "../../cv/entities/cv.entity";


@Entity('user')
export class UserEntity extends TimeStampColumns{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length:50, unique: true})
  username: string;
  @Column()
  email: string;
  @Column(
    {
      type: 'enum',
      enum: UserRoleEnum,
      default: UserRoleEnum.USER
    }
  )
  role: string;

  @Column()
  password:string;

  @OneToMany(
    type => CvEntity,
    (cv) => cv.user,
    {
      nullable: true,
      cascade: true,
      eager: true
    }
  )
  cvs: CvEntity[];
}
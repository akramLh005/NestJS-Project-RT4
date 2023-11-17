import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CvEntity } from "./entities/cv.entity";
import { CreateCvDto } from "./dto/create-cv.dto";
import { UpdateCvDto } from "./dto/update-cv.dto";
import {UserEntity} from "../user/entities/user.entity";
import {SkillEntity} from "../skill/entities/skill.entity";
import {CrudService} from "../generics/CrudService";


@Injectable()
export class CvService extends CrudService<CvEntity,CreateCvDto, UpdateCvDto>{
  constructor(
    @InjectRepository(CvEntity)
    private cvRepository: Repository<CvEntity>,

  ) {
    super(cvRepository);
  }

  async create(newCv: CreateCvDto): Promise<CvEntity> {
    return super.create(newCv);
  }

  async getAllCvs() {
      let cvs = super.findAll();
      (await cvs).forEach(cv => {
        delete cv.DeletedAt;
        delete cv.UpdatedAt;
      })
      return cvs;
  }

  async findOne(id: number) {
   return super.findOne(id);
  }

  async removeCv (id : number) {
    return  super.remove(id)
  }


  async updateCv(id: number, cv: UpdateCvDto): Promise<CvEntity> {

    const newCv = await this.cvRepository.preload(
      {
        id,
        ...cv
      }
    )
    if(! newCv) {
      throw new NotFoundException(`Le cv d'id ${id} n'existe pas`);
    }
    try {
      return await this.cvRepository.save(newCv);
    } catch (error) {
      throw new HttpException('Failed to update CV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCvViaCriteria(Criteria, cv: UpdateCvDto) {
     return  this.cvRepository.update(Criteria, cv)
  }



  async addUserToCv(cvId: number, userId: number): Promise<void> {
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['user'],
    });
    if (!cv) throw new Error('CV not found');

    const user = new UserEntity();
    user.id = userId; // Assuming you have the user ID
    cv.user = user; // Associate the user with the CV

    await this.cvRepository.save(cv);
  }

  async addSkillsToCv(cvId: number, skillIds: number[]): Promise<void> {
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['skills'],
    });
    if (!cv) throw new Error('CV not found');

    cv.skills = skillIds.map(id => {
      const skill = new SkillEntity();
      skill.id = id;
      return skill;
    });

    await this.cvRepository.save(cv);
  }




  // async addSkill(cv_id: number, skill_id: number, user_id: number) {
  //   try {
  //     let cv = await this.cvRepository.findOne({
  //       where: { id: cv_id },
  //       relations: ['skills', 'user']
  //     });
  //     if (cv) {
  //       if (user_id != cv.user.id) {
  //         throw new HttpException(
  //           'You are not authorized to add skills to this cv',
  //           HttpStatus.UNAUTHORIZED
  //         );
  //       }
  //       let skill = await this.skillRepository.findOne({
  //         where: { id: skill_id },
  //         relations: ['cvs']
  //       });
  //       if (!skill) {
  //         throw new HttpException(
  //           'Skill not found',
  //           HttpStatus.NOT_FOUND
  //         );
  //       }
  //       skill.cvs.push(cv);
  //       cv.skills.push(skill);
  //       await this.cvRepository.save(cv);
  //       await this.skillRepository.save(skill);
  //       return 'Skill added successfully';
  //     }
  //     else {
  //       throw new HttpException(
  //         'Cv not found',
  //         HttpStatus.NOT_FOUND
  //       );
  //     }
  //   }
  //   catch {
  //     throw new HttpException(
  //       'Error adding skill',
  //       HttpStatus.NOT_ACCEPTABLE
  //     );
  //   }
  // }
  //
  // async delete(cv_id: number, user_id: number) {
  //   try {
  //     const cv = await this.cvRepository.findOne({ where: { id: cv_id }, relations: ['user'] });
  //     if (cv.user.id == user_id) {
  //       await this.cvRepository.delete(cv_id);
  //       return 'Cv deleted successfully';
  //     }
  //     else {
  //       throw new HttpException(
  //         'You are not authorized to delete this cv',
  //         HttpStatus.UNAUTHORIZED
  //       );
  //     }
  //   }
  //   catch {
  //     throw new HttpException(
  //       'Error deleting cv',
  //       HttpStatus.NOT_ACCEPTABLE
  //     );
  //   }
  // }

}
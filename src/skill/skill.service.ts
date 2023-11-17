import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {SkillEntity} from "./entities/skill.entity";

@Injectable()
export class SkillService {

  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
  ) {
  }


  async create(createSkillDto: CreateSkillDto): Promise<SkillEntity> {
    // Create a new skill entity and save it to the database
    const skill = this.skillRepository.create(createSkillDto);
    await this.skillRepository.save(skill);
    return skill;
  }

  async findAll(): Promise<SkillEntity[]> {
    return await this.skillRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
  async findByDesignation(designation: string): Promise<SkillEntity> {
    return this.skillRepository.findOne({ where: { designation } });
  }

}

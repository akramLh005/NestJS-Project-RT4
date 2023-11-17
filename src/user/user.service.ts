import { Injectable } from '@nestjs/common';

import { randEmail, randFirstName, randPassword } from "@ngneat/falso";
import { InjectRepository } from '@nestjs/typeorm';
import {UserEntity} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Repository} from "typeorm";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>

  ) { }


  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Create a new user entity and save it to the database
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


async seedDataUser() {
  const usersData = Array(10)
    .fill(null)
    .map(() => {
      const user = new UserEntity();
      user.username = randFirstName();
      user.email = randEmail();
      user.password = randPassword();
      return this.userRepository.save(user);
    });
}



}

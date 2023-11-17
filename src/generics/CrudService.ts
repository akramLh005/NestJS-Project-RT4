import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {DeepPartial, EntityManager, EntityTarget, Repository} from 'typeorm';


export abstract class CrudService<T, CreateDto, UpdateDto> {
  constructor(private readonly repository) {}

  async create(createDto: CreateDto): Promise<T> {
    try {
      const newEntity = this.repository.create(createDto);
      return await this.repository.save(newEntity);
    } catch (error) {
      throw new HttpException('Failed to create entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Error in fetching entities', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const entity = await this.repository.findOne(id);
      if (!entity) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }
      return entity;
    } catch (error) {
      throw new HttpException('Error fetching entity', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async update(id: number, updateDto: UpdateDto): Promise<(DeepPartial<T> & T)[]> {
    try {
      const foundEntity = await this.findOne(id);
      const updatedEntity = { ...foundEntity, ...updateDto };
      return await this.repository.save(updatedEntity);
    } catch (error) {
      throw new HttpException('Failed to update entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const entityToRemove = await this.findOne(id);
      await this.repository.remove(entityToRemove);
      return `Entity with id ${id} removed successfully`;
    } catch (error) {
      throw new HttpException('Failed to remove entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
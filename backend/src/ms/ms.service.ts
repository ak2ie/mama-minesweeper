import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { CreateMSDto } from './dto/create-ms.dto';
import { UpdateMDto } from './dto/update-m.dto';
import { MineSweeper } from './models/ms.model';

@Injectable()
export class MsService {
  async create(createMSDto: CreateMSDto) {
    const msRepository = getRepository(MineSweeper);
    const ms = new MineSweeper();
    ms.panels = [{ imageUrl: '', isBomb: false }];
    ms.createdAt = new Date();
    await msRepository.create(ms);
    return 'This action adds a new m';
  }

  findAll() {
    return `This action returns all ms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} m`;
  }

  update(id: number, updateMDto: UpdateMDto) {
    return `This action updates a #${id} m`;
  }

  remove(id: number) {
    return `This action removes a #${id} m`;
  }
}

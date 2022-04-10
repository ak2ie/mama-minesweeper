import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { CreateMSDto } from './dto/create-ms.dto';
import { UpdateMDto } from './dto/update-m.dto';
import { MineSweeper } from './models/ms.model';

@Injectable()
export class MsService {
  async create(createMSDto: CreateMSDto) {
    const isAllUrlSet = createMSDto.panels.every((panel) => panel.imageUrl !== "");
    if (!isAllUrlSet) {
      throw new Error("URLが設定されていないマスがあります。")
    }
    const existsBomb = createMSDto.panels.some(panel => panel.isBomb)
    if (!existsBomb) {
      throw new Error("地雷が設定されていません")
    }
    const isAllBomb = createMSDto.panels.every(panel => panel.isBomb)
    if (isAllBomb){
      throw new Error("すべてのマスが地雷です")
    }
    const msRepository = getRepository(MineSweeper);
    const ms = new MineSweeper();
    ms.panels = [{ imageUrl: '', isBomb: false }];
    ms.createdAt = new Date();
    const newDoc = await msRepository.create(ms);
    return newDoc.id;
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

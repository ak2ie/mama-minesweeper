import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { CreateMSDto } from './dto/create-ms.dto';
import { MineSweeper } from './models/ms.model';

@Injectable()
export class MsService {
  /**
   * マインスイーパの画像、地雷を登録しIDを返す
   * @param createMSDto
   * @returns マインスイーパID
   */
  async create(createMSDto: CreateMSDto) {
    const isAllUrlSet = createMSDto.panels.every(
      (panel) => panel.imageUrl !== '',
    );
    if (!isAllUrlSet) {
      throw new Error('URLが設定されていないマスがあります。');
    }
    const existsBomb = createMSDto.panels.some((panel) => panel.isBomb);
    if (!existsBomb) {
      throw new Error('地雷が設定されていません');
    }
    // " "で囲まれているとそのままでは正しく判定できない
    const isAllBomb = createMSDto.panels.every(
      (panel) => panel.isBomb === true,
    );
    if (isAllBomb) {
      throw new Error('すべてのマスが地雷です');
    }
    const msRepository = getRepository(MineSweeper);
    const ms = new MineSweeper();
    ms.panels = createMSDto.panels;
    ms.createdAt = new Date();
    const newDoc = await msRepository.create(ms);
    return newDoc.id;
  }

  /**
   * マインスイーパの画像と地雷かどうかを返す
   * @param id マインスイーパID
   * @returns マインスイーパの画像URLと地雷かどうか
   */
  async findOne(id: string) {
    const msRepository = getRepository(MineSweeper);
    const ms = await msRepository.findById(id);
    if (ms === null) {
      throw new Error('マインスイーパが登録されていません');
    }
    return ms.panels;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { CreateMSDto } from './dto/create-ms.dto';
import { MsService } from './ms.service';
import { MineSweeper, Panel } from './models/ms.model';

jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    getRepository: () => ({
      create: (_) => {
        const ms = new MineSweeper();
        ms.id = '1';
        return ms;
      },
      findById: (id: string) => {
        if (id === 'validId') {
          return new Promise((resolve, _) => {
            const ms = new MineSweeper();
            ms.panels = [new Panel('dummy1', false), new Panel('dummy2', true)];
            ms.title = 'ダミータイトル';
            ms.message = 'ダミーメッセージ';
            resolve(ms);
          });
        } else if (id === 'invalidId') {
          return new Promise((resolve, _) => {
            resolve(undefined);
          });
        }
      },
    }),
  };
});

describe('登録', () => {
  let service: MsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsService],
    }).compile();

    service = module.get<MsService>(MsService);
  });

  it('URLが空', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: '', isBomb: false }];
    await expect(service.create(dto)).rejects.toThrow();
  });

  it('地雷なし', async () => {
    const dto = new CreateMSDto();
    dto.panels = [
      { imageUrl: 'dummy', isBomb: false },
      { imageUrl: 'dummy', isBomb: false },
    ];
    await expect(service.create(dto)).rejects.toThrow();
  });

  it('すべて地雷', async () => {
    const dto = new CreateMSDto();
    dto.panels = [
      { imageUrl: 'dummy', isBomb: true },
      { imageUrl: 'dummy', isBomb: true },
    ];
    await expect(service.create(dto)).rejects.toThrow();
  });

  it('正常', async () => {
    const dto = new CreateMSDto();
    dto.panels = [
      { imageUrl: 'dummy1', isBomb: true },
      { imageUrl: 'dummy2', isBomb: false },
    ];
    expect(await service.create(dto)).toBe('1');
  });
});

describe('取得', () => {
  let service: MsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsService],
    }).compile();

    service = module.get<MsService>(MsService);
  });

  it('正常', async () => {
    expect(await service.findOne('validId')).toEqual({
      panels: [new Panel('dummy1', false), new Panel('dummy2', true)],
      title: 'ダミータイトル',
      message: 'ダミーメッセージ',
    });
  });

  it('データなし', async () => {
    await expect(service.findOne('invalidId')).rejects.toThrow();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateMSDto } from './dto/create-ms.dto';
import { MsService } from './ms.service';
import { MineSweeper } from './models/ms.model';

jest.mock('fireorm', () => {
    return {
        Collection: () => jest.fn(),
        getRepository: () => ({
            create: (_) => {
              const ms =  new MineSweeper()
              ms.id = "1";
              return ms;
            },
        })
    }
})

describe('MsService', () => {
  let service: MsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsService],
    }).compile();

    service = module.get<MsService>(MsService);
    jest.resetModules();
    jest.doMock("fireorm");
  });

  xit('URLが空', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: '', isBomb: false }];
    await expect(service.create(dto)).rejects.toThrow();
  });

  xit('地雷なし', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: 'dummy', isBomb: false }, { imageUrl: 'dummy', isBomb: false }];
    await expect(service.create(dto)).rejects.toThrow();
  });

  xit('すべて地雷', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: 'dummy', isBomb: true }, { imageUrl: 'dummy', isBomb: true }];
    await expect(service.create(dto)).rejects.toThrow();
  });

  it('正常', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: 'dummy1', isBomb: true }, { imageUrl: 'dummy2', isBomb: false }];
    expect(await service.create(dto)).toBe("1");
  });
});
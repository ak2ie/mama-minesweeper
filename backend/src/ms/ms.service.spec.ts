import { Test, TestingModule } from '@nestjs/testing';
import { CreateMSDto } from './dto/create-ms.dto';
import { MsService } from './ms.service';
import { getRepository, Collection } from 'fireorm';

let getRepositoryMMock;
jest.mock('fireorm', () => {
  const CollectionMMock = Collection as jest.Mock;
  CollectionMMock.mockReturnThis();
  getRepositoryMMock = getRepository as jest.Mock;
});

describe('MsService', () => {
  let service: MsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsService],
    }).compile();

    service = module.get<MsService>(MsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('invalid call', async () => {
    const dto = new CreateMSDto();
    dto.panels = [{ imageUrl: '', isBomb: false }];
    getRepositoryMMock.mockImplementation((aa) => {
      return {
        create: () => {},
      };
    });
    expect(await service.create(dto)).toBe('');
  });
});

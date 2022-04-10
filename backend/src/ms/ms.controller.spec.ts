import { Test, TestingModule } from '@nestjs/testing';
import { MsController } from './ms.controller';
import { MsService } from './ms.service';

describe('MsController', () => {
  let controller: MsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsController],
      providers: [MsService],
    }).compile();

    controller = module.get<MsController>(MsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

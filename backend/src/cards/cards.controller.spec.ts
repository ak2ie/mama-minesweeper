import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { LoggerModule } from 'nestjs-pino';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('CardsController', () => {
  let controller: CardsController;
  let cardsService: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService, ConfigService],
      imports: [HttpModule, LoggerModule.forRoot()],
    }).compile();

    controller = module.get<CardsController>(CardsController);

    cardsService = module.get<CardsService>(CardsService);
  });

  it('NGワードなし', async () => {
    const param = new CreateCardDto();
    param.text = 'ダミー';

    jest.spyOn(cardsService, 'create').mockImplementation(async () => {
      return true; // NGワードチェックAPI:問題なし
    });
    expect(await controller.create(param)).toEqual({
      result: 'OK',
    });
  });

  it('NGワードあり', async () => {
    const param = new CreateCardDto();
    param.text = 'ダミー';

    jest.spyOn(cardsService, 'create').mockImplementation(async () => {
      return false; // NGワードチェックAPI:問題あり
    });
    expect(await controller.create(param)).toEqual({
      result: 'NG',
    });
  });

  it('エラー', async () => {
    const param = new CreateCardDto();
    param.text = 'ダミー';

    jest.spyOn(cardsService, 'create').mockImplementation(async () => {
      throw new Error('エラー');
    });
    await expect(controller.create(param)).rejects.toThrow();
  });
});

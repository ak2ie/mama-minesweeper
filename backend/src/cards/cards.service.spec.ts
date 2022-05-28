import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CardsService } from './cards.service';
import { AxiosResponse } from 'axios';
import { CreateCardDto } from './dto/create-card.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

describe('CardsService', () => {
  let service: CardsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService, ConfigService],
      imports: [HttpModule, LoggerModule.forRoot()],
    }).compile();

    service = module.get<CardsService>(CardsService);

    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('NGワードあり', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(responseExistsNGWords));

    const param = new CreateCardDto();
    param.text = 'ダミーテキスト_NGワードあり';
    expect(await service.create(param)).toEqual(false);
  });

  it('NGワードなし', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(responseNotExistsNGWords));

    const param = new CreateCardDto();
    param.text = 'ダミーテキスト_NGワードなし';
    expect(await service.create(param)).toEqual(true);
  });

  it('APIエラー', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(responseAPIError));

    const param = new CreateCardDto();
    param.text = 'ダミーテキスト';
    expect(await service.create(param)).toEqual(false);
  });

  // NGワードあり レスポンス
  const responseExistsNGWords: AxiosResponse<any> = {
    data: {
      rsp: {
        '@attributes': {
          stat: 'ok',
        },
        method: 'webpurify.live.check',
        format: 'rest',
        found: '1', // NGワードあり
        api_key: 'dummy_api_key',
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' },
  };

  // NGワードなし レスポンス
  const responseNotExistsNGWords: AxiosResponse<any> = {
    data: {
      rsp: {
        '@attributes': {
          stat: 'ok',
        },
        method: 'webpurify.live.check',
        format: 'rest',
        found: '0', // NGワードなし
        api_key: 'dummy_api_key',
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' },
  };

  // APIエラー レスポンス
  const responseAPIError: AxiosResponse<any> = {
    data: {
      rsp: {
        '@attributes': {
          stat: 'fail',
        },
        err: {
          '@attributes': {
            code: '100',
            msg: 'Invalid API Key',
          },
        },
        text: 'testing 1 2 3',
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' },
  };
});

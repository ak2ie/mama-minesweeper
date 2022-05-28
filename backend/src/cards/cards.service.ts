import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCardDto } from './dto/create-card.dto';
import { Logger } from 'nestjs-pino';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ProfanityFilterSuccessResponse } from './ProfanityFilterResponse';

@Injectable()
export class CardsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  /**
   * NGワードをチェックし、カード作成可能かを判断する
   * @param createCardDto チェック対象テキスト
   * @returns カード作成可能（NGワード含まない）ならtrue
   */
  async create(createCardDto: CreateCardDto) {
    let ngWordsCount = 1;

    try {
      const result = await lastValueFrom(
        this.httpService
          .get(
            `https://api1-ap.webpurify.com/services/rest/?method=webpurify.live.check&api_key=${this.configService.get(
              'PROFANITY_FILTER_API_KEY',
            )}&text=${encodeURIComponent(
              createCardDto.text,
            )}&lang=ja&semail=1&sphone=1&slink=1&format=json`,
          )
          .pipe(map((response) => response.data)),
      );

      if (this.isAPISuccessResponse(result)) {
        ngWordsCount = Number(result.rsp.found);
      } else {
        this.logger.error(`APIエラー:${JSON.stringify(result)}`);
      }
    } catch (e) {
      this.logger.error(e);
    }

    return ngWordsCount === 0;
  }

  private isAPISuccessResponse(
    val: any,
  ): val is ProfanityFilterSuccessResponse {
    if (!('rsp' in val)) {
      return false;
    }

    if (!('@attributes' in val.rsp)) {
      return false;
    }

    if (!('stat' in val.rsp['@attributes'])) {
      return false;
    } else {
      if (val.rsp['@attributes'].stat !== 'ok') {
        return false;
      }
    }

    if (
      'method' in val.rsp &&
      'format' in val.rsp &&
      'found' in val.rsp &&
      'api_key' in val.rsp
    ) {
      if (typeof val.rsp.found !== 'string' || val.rsp.found.length === 0) {
        return false;
      }

      return true;
    }

    return false;
  }
}

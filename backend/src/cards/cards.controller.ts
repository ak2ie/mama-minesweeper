import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Logger } from 'nestjs-pino';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly logger: Logger,
  ) {}

  /**
   * カード作成
   * @param createCardDto カードのテキスト
   * @returns カード作成可否
   */
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    try {
      const canCreateCard = await this.cardsService.create(createCardDto);
      const result = canCreateCard === true ? 'OK' : 'NG';
      return {
        result,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

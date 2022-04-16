import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { MsService } from './ms.service';
import { CreateMSDto } from './dto/create-ms.dto';
import { Logger } from 'nestjs-pino';

@Controller('ms')
export class MsController {
  constructor(
    private readonly msService: MsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createMSDto: CreateMSDto) {
    this.logger.log('リクエスト', createMSDto);
    const id = await this.msService.create(createMSDto);
    this.logger.log(`レスポンス:${id}`);
    return id;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const panels = await this.msService.findOne(id);
      return { panels };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

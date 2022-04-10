import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
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
  async create(@Body() createMSDto: CreateMSDto) {
    return await this.msService.create(createMSDto);
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

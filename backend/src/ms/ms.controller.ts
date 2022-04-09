import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MsService } from './ms.service';
import { CreateMSDto } from './dto/create-ms.dto';
import { UpdateMDto } from './dto/update-m.dto';

@Controller('ms')
export class MsController {
  constructor(private readonly msService: MsService) {}

  @Post()
  async create(@Body() createMSDto: CreateMSDto) {
    return await this.msService.create(createMSDto);
  }

  @Get()
  findAll() {
    return this.msService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.msService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMDto: UpdateMDto) {
    return this.msService.update(+id, updateMDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.msService.remove(+id);
  }
}

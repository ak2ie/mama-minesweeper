import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [HttpModule],
})
export class CardsModule {}

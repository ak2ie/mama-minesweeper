import { Module } from '@nestjs/common';
import { MsService } from './ms.service';
import { MsController } from './ms.controller';

@Module({
  controllers: [MsController],
  providers: [MsService]
})
export class MsModule {}

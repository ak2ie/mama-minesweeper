import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MsModule } from './ms/ms.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

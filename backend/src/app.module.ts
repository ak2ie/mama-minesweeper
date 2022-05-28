import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsModule } from './ms/ms.module';
import { LoggerModule } from 'nestjs-pino';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    MsModule,
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'development'
          ? {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'yyyy/mm/dd hh:MM:ss Z',
                },
              },
            }
          : {},
    }),
    CardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

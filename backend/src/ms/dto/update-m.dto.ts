import { PartialType } from '@nestjs/swagger';
import { CreateMSDto } from './create-ms.dto';

export class UpdateMDto extends PartialType(CreateMSDto) {}

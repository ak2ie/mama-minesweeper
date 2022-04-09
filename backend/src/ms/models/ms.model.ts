import { Collection } from 'fireorm';

@Collection()
export class MineSweeper {
  id!: string;
  panels: Array<{
    imageUrl: string;
    isBomb: boolean;
  }>;
  createdAt: Date;
}

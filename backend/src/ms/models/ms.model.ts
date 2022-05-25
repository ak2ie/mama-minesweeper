import { Collection } from 'fireorm';

@Collection()
export class MineSweeper {
  id!: string;
  panels: Array<Panel>;
  title: string;
  message: string;
  createdAt: Date;
}

export class Panel {
  constructor(public imageUrl: string, public isBomb: boolean) {}
}

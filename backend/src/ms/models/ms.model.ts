import { Collection } from 'fireorm';

@Collection()
export class MineSweeper {
  id!: string;
  panels: Array<Panel>;
  createdAt: Date;
}

export class Panel {
  constructor(public imageUrl: string, public isBomb: boolean) {}
}

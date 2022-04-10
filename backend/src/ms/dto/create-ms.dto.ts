export class CreateMSDto {
  /**
   * マス目
   */
  panels: { imageUrl: string; isBomb: boolean }[];
}

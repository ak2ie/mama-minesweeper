export class CreateMSDto {
  /**
   * マス目
   */
  panels: { imageUrl: string; isBomb: boolean }[];
  /**
   * タイトル
   */
  title: string;
  /**
   * メッセージ
   */
  message: string;
}

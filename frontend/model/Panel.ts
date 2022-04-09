/**
 * 1つのマス
 */
export class Panel {
  /**
   *
   * @param imageUrl 画像URL
   * @param isBomb 地雷かどうか（trueなら地雷）
   */
  constructor(public imageUrl: string, public isBomb: boolean) {
    if (imageUrl === '') {
      throw new Error('画像URLを設定してください')
    }
  }
}

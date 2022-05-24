import { Panel } from './Panel'

/**
 * マス全体
 */
export class Grid {
  /**
   *
   * @param panels マス目全体
   * @param columnCount 列数
   * @param title タイトル
   * @param message メッセージ
   */
  constructor(
    public panels: Panel[],
    private columnCount: number,
    public title: string,
    public message: string
  ) {
    if (columnCount <= 0) {
      throw new Error('列数には1以上の値を設定してください')
    } else if (columnCount > panels.length) {
      throw new Error('列数にはマス目の個数以下の値を設定してください')
    }

    if (panels === null || panels === undefined || panels.length === 0) {
      throw new Error('マスを設定してください。')
    }
  }

  /**
   * 行数を返す
   * @returns 行数
   */
  public RowCount(): number {
    return this.panels.length / this.columnCount
  }

  /**
   * 列数を返す
   * @returns 列数
   */
  public ColumnCount(): number {
    return this.columnCount
  }

  /**
   * 地雷の数を返す
   * @returns 地雷の数
   */
  public BombsCount(): number {
    let bombs = 0
    for (let i = 0; i < this.panels.length; i++) {
      if (this.panels[i].isBomb) {
        bombs++
      }
    }
    return bombs
  }
}

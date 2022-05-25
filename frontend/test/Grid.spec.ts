import { Grid } from '~/model/Grid'
import { Panel } from '~/model/Panel'

describe('マス目全体', () => {
  it('列数', () => {
    const grid = new Grid(
      [new Panel('a', false), new Panel('a', false), new Panel('a', false)],
      1,
      'ダミータイトル',
      'ダミーメッセージ'
    )
    expect(1).toBe(grid.ColumnCount())
  })

  it('行数', () => {
    const grid = new Grid(
      [
        new Panel('a', false),
        new Panel('a', false),
        new Panel('a', false),
        new Panel('a', false),
        new Panel('a', false),
        new Panel('a', false),
      ],
      2,
      'ダミータイトル',
      'ダミーメッセージ'
    )
    expect(3).toBe(grid.RowCount())
  })

  it('地雷の数', () => {
    const grid = new Grid(
      [
        new Panel('a', true),
        new Panel('a', false),
        new Panel('a', true),
        new Panel('a', false),
        new Panel('a', true),
        new Panel('a', false),
      ],
      2,
      'ダミータイトル',
      'ダミーメッセージ'
    )
    expect(3).toBe(grid.BombsCount())
  })
})

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import axios from 'axios'
import { Grid } from '~/model/Grid'
import { Panel } from '~/model/Panel'

export const state = () => ({
  grid: new Grid([new Panel('test', false)], 1, '', ''),
})

export type RootState = ReturnType<typeof state>

export const getters = getterTree(state, {
  grid: (state) => state.grid,
})

export const mutations = mutationTree(state, {
  initGridMutation(state, grid): void {
    state.grid = grid
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async initGrid({ commit }, id: string) {
      if (id !== 'dummy-id') {
        const response = await axios.get(
          `https://asia-northeast1-mama-ms.cloudfunctions.net/api/ms/${id}`
        )
        const mineSweeper: { panels: Panel[]; title: string; message: string } =
          response.data
        commit(
          'initGridMutation',
          new Grid(
            mineSweeper.panels.map((panel) => {
              return new Panel(panel.imageUrl, panel.isBomb)
            }),
            3, // マスの列数
            mineSweeper.title,
            mineSweeper.message
          )
        )
      } else {
        // ------ 後で変更(APIからデータ取得) ----------------------
        const imagePaths = [
          '025.png',
          '029.png',
          '037.png',
          '040.png',
          '050.png',
          '053.png',
          '054.png',
          '056.png',
          '057.png',
        ]
        // マス目設定
        const panels: Panel[] = []
        for (let i = 0; i < imagePaths.length; i++) {
          panels.push(new Panel(`images/${imagePaths[i]}`, false))
        }
        // 地雷設定
        let bombs = 5
        while (bombs > 0) {
          const num = Math.floor(Math.random() * imagePaths.length)
          if (panels[num].isBomb === false) {
            bombs -= 1
            panels[num].isBomb = true
          }
        }
        commit(
          'initGridMutation',
          new Grid(panels, 3, 'マママインスイーパー', 'ありがとう')
        )
      }
    },
  }
)

import { getAccessorType } from 'typed-vuex'

// *** 要修正 ***
// データを追加
import * as GridManager from '~/store/GridManager'

// ここは修正不要。そのまま残しておくこと！
export const state = () => {
  return {}
}

export const getters = {
  //
}

export const mutations = {
  //
}

export const actions = {
  //
}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    // *** 要修正 ***
    // データを追加したら、ここにも追加
    GridManager,
  },
})

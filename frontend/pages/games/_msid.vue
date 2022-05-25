<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8">
      <div v-if="isError">エラー</div>
      <minesweeper-game v-else></minesweeper-game>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import MinesweeperGame from '~/components/vue-minesweeper/MinesweeperGame.vue'

export type DataType = {
  msid: string
  isError: boolean
}

type MethodType = {}
type ComputedType = {}
type PropType = {}

export default Vue.extend({
  components: { MinesweeperGame },
  data(): DataType {
    return {
      msid: '',
      isError: false,
    }
  },
  async fetch() {
    if (process.client) {
      try {
        this.msid = this.$route.path.replace('/games/', '')
        if (this.msid.match(/[0-9a-zA-Z]+/)) {
          await this.$accessor.GridManager.initGrid(this.msid)
        }
      } catch (e) {
        this.isError = true
      }
    }
  },
  head() {
    return {
      title: this.$accessor.GridManager.grid.title ?? 'ゲームプレイ'
    }
  },
  created() {},
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>

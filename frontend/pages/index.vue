<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <minesweeper-game :cols="5" :rows="5" :bombs="2"></minesweeper-game>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import MinesweeperGame from '~/components/vue-minesweeper/MinesweeperGame.vue'

export type DataType = {}

export default Vue.extend({
  components: { MinesweeperGame },
  data(): DataType {
    return {}
  },
  head() {
    return {
      title: 'トップ',
    }
  },
  mounted() {},
})
</script>

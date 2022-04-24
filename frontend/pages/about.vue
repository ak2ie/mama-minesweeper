<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h2>このサイトについて</h2>
      以下の素材を使用しています。
      <ul>
        <li>
          <a href="https://commons.nicovideo.jp/material/nc94318"
            >爆発（1080×1080／合成用マスクあり）</a
          >（ID:nc94318）
        </li>
      </ul>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export type DataType = {}

export default Vue.extend({
  data(): DataType {
    return {}
  },
  head() {
    return {
      title: 'このサイトについて2222',
    }
  },
  async mounted() {
    await this.$accessor.GridManager.initGrid('dummy-id')
    console.log(this.$config.PROJECT_ID)
  },
})
</script>

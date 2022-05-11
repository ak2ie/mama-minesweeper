<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h2>このサイトについて</h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        一コマ漫画の画像は白目みさえ様からご提供いただいています。
        <h3>白目みさえ 公式サイト</h3>
        <ul class="d-flex align-center">
          <li><a href="https://lit.link/shiromemisae" target="_blank">Lit.Link</a></li>
          <li class="icon-link">
            <v-btn href="https://www.instagram.com/misae_mon/" target="_blank" icon outlined large>
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </li>
          <li class="icon-link">
            <v-btn href="https://twitter.com/misae_yjm" target="_blank" icon outlined large>
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
          </li>
          <li><a href="https://hibishirome.nbblog.jp/" target="_blank">ブログHP</a></li>
        </ul>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h3>ライセンス表記</h3>
        以下の素材を使用しています。
        <ul>
          <li>
            <a href="https://commons.nicovideo.jp/material/nc94318" target="_blank"
              >爆発（1080×1080／合成用マスクあり）</a
            >（ID:nc94318）
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
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
      title: 'このサイトについて',
    }
  },
  async mounted() {
    await this.$accessor.GridManager.initGrid('dummy-id')
  },
})
</script>

<style scoped>
ul li {
  list-style: none;
  margin-right: 1rem;
}
</style>

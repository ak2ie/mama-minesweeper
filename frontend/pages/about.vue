<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h2>このサイトについて</h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h3>イラストについて</h3>
        一コマ漫画のイラストは白目みさえ様からご提供いただいています。
        <div class="text-center my-4">
          <h4>白目みさえ 公式サイト</h4>
          <ul class="d-flex align-center justify-center">
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
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h3>クッキー（Cookie）について</h3>
        <div>
          <p>
            本アプリの一部ではクッキーを使用しています。<br/>
            クッキーとは、Webコンテンツからの要求で利用者の手元の端末に一時的に保存されるデータのことで、本アプリでは利用状況の把握のためにクッキーを使用する場合があります。
          </p>
          <p>
            ブラウザに関する情報の収集を希望しない場合は、インターネット閲覧ソフト（ブラウザ）をご自身で設定することにより、クッキーの機能が働かないようにすることも可能です。
          </p>
          <p>
            ただし、クッキーを受け入れない設定をされている場合は、本アプリの機能が正常に動作しない場合があります。</p>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h3>Google Analytics for FirebaseまたはFirebase Analyticsについて</h3>
        <div>
          <p>
            Google Analytics for FirebaseまたはFirebase Analyticsは、Google LLCが提供する分析サービスです。<br/>
            Googleによるデータの使用については、<a href="https://www.google.com/policies/privacy/partners/" target="_blank">Googleのパートナーポリシー</a>を参照してください。
          </p>
          <p>
            Firebase Analyticsは、クラッシュレポート、認証、リモート設定、通知など、Firebaseが提供する他のツールとデータを共有することがあります。ユーザーは、このプライバシーポリシーで、所有者が使用する他のツールの詳細な説明を確認することができます。
          </p>
          <p>
            本アプリは、Firebase Analyticsサービスを実行するために、モバイルデバイスの識別子とクッキーに類似した技術を使用しています。
          </p>
          <p>
            ユーザーは、携帯電話のデバイス広告設定などの該当するデバイスの設定、または本プライバシーポリシーの他のFirebase関連セクションの指示がある場合はそれに従って、特定のFirebase機能をオプトアウトすることができます。
          </p>
        </div>
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
h3 {
  margin-bottom: 1rem;
}
ul {
  padding-left: 0;
}
ul li {
  list-style: none;
  margin-right: 1rem;
}
</style>

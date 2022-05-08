<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8"  class="text-center">
        <img src="/images/index-logo.png" width="350" height="300" />
        <div class="bombs">
          <v-icon v-for="n of 5" :key="n" large :class="isBomb() ? 'pink-bomb' : 'black-bomb'">mdi-bomb</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="#83D2FF" class="button rounded-lg" height="77" @click="startGame">ためす</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="#FFE353" class="button rounded-lg" height="77" to="setting">ゲームを作る</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="#FFB9D6" class="button rounded-lg" height="77" :to="{ path: '/setting/manga-generator', query: { modal: false } }">カードを作る</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'トップ',
    }
  },
  async mounted() {
  },
  methods: {
    startGame(){
      this.$router.push({ name: 'games-msid', params: {msid: this.$config.TRY_GAME_ID ?? "dummy" }});
    },
    isBomb() :boolean {
      return Math.random() > 0.6;
    }
  }
})
</script>

<style lang="scss" scoped>
.bombs {
  padding: 0 15%;
  display: flex;
  justify-content: space-between;

  .black-bomb {
    color: #555555;
  }

  .pink-bomb {
    color: #FF5CBE;
  }
}

.button {
  font-size: 25px;
  box-shadow: 3px 4px 7px rgba(0, 0, 0, 0.15), inset 0px -8px 0px rgba(0, 0, 0, 0.21);
}
</style>

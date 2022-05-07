<template>
  <v-container>
    <v-dialog v-model="gameIdModal">
      <v-form ref="gameIdForm">
        <v-card>
          <v-card-title>IDを入力してください</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="gameId" label="ゲームID*" :rules="[required]" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="startGame">
              ゲーム開始
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-row justify="center">
      <v-col cols="12" sm="8"  class="text-center">
        <img src="/images/index-logo.png" width="350" height="300" />
        <div class="bombs">
          <v-icon class="pink-bomb" large>mdi-bomb</v-icon>
          <v-icon class="pink-bomb" large>mdi-bomb</v-icon>
          <v-icon class="black-bomb" large>mdi-bomb</v-icon>
          <v-icon class="black-bomb" large>mdi-bomb</v-icon>
          <v-icon class="pink-bomb" large>mdi-bomb</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="#83D2FF" class="button rounded-lg" height="77" @click="setGameId">あそぶ</v-btn>
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

export type DataType = {
  gameIdModal: boolean,
  gameId: string,
  required: (param: any) => any;
}

export default Vue.extend({
  data(): DataType {
    return {
      gameIdModal: false,
      gameId: "",
      required: (value: any) => !!value || "必ず入力してください",
    }
  },
  head() {
    return {
      title: 'トップ',
    }
  },
  async mounted() {
  },
  methods: {
    setGameId(){
      this.gameIdModal = true;
    },
    startGame(){
      if (this.$refs.gameIdForm.validate()) {
        this.gameIdModal = false;
        this.$router.push({ name: 'games-msid', params: {msid: this.gameId }})
      }
    },
    isBomb() :boolean {
      return Math.random() > 0.7;
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
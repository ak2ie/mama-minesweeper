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
      <v-col cols="12" sm="8">
        <h1 class="text-center text-h5 text-sm-h4 text-md-h3">マママインスイーパー</h1>
        <div v-for="i of 4" :key="i" class="text-center">
          <v-icon v-for="n of 4" :key="n" x-large :color="isBomb() ? 'red' : 'grey'">mdi-bomb</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="secondary" @click="setGameId">あそぶ</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="secondary" to="setting">ゲームを作る</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block x-large color="secondary" to="manga-generator">カードを作る</v-btn>
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

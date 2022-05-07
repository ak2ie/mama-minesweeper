<template>
  <div class="generator-container">
    <div ref="result" class="manga-container">
      <img :src="`/images/manga/${imageFileName}`" alt="" />
      <div
        class="manga-text-outer"
        :style="styleObject"
      >
        <p v-if="text" class="manga-text">
          <span class="first-letter">{{ text.substr(0, 1) }}</span>
          <span v-html="text.substr(1).replace('\n', '<br/>')"></span>
        </p>
      </div>
      <p class="credit-text">イラスト：白目みさえ</p>
    </div>
    <div class="footer-container">
      <v-alert v-if="downloadURL" type="success" class="mt-6 text-center mx-3" dismissible>
        <p class="text-center">カードを保存しました！</p>
        <a :href="downloadURL" target="_blank">保存したカードを表示する</a>
      </v-alert>
      <div class="actions-container">
        <div class="input-wrap mt-4 mx-auto">
          <v-textarea v-model="text" rows="3" outlined clearable />
        </div>
        <div class="row justify-center">
          <div class="ma-2">
            <v-btn color="#FFB9D6" height="65" class="button rounded-lg" fab @click="moveUp">
              <v-icon>
                mdi-arrow-up-thick
              </v-icon>
            </v-btn>
          </div>
          <div class="ma-2">
            <v-btn color="#FFB9D6" height="65" class="button rounded-lg" fab @click="moveDown">
              <v-icon>
                mdi-arrow-down-thick
              </v-icon>
            </v-btn>
          </div>
          <div class="ma-2">
            <v-btn color="#FFB9D6" height="65" class="button rounded-lg" fab @click="moveLeft">
              <v-icon>
                mdi-arrow-left-thick
              </v-icon>
            </v-btn>
          </div>
          <div class="ma-2">
            <v-btn color="#FFB9D6" height="65" class="button rounded-lg" fab @click="moveRight">
              <v-icon>
                mdi-arrow-right-thick
              </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="button-wrap mt-6 mx-auto">
          <v-dialog
            v-model="isOpenDialog"
            max-width="290"
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="isBlank"
                color="#FFB9D6"
                class="button rounded-lg"
                block
                large
                v-bind="attrs"
                height="61"
                v-on="on"
              >
                カードを保存
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h6">
                サーバーに送信し、カード画像を保存します。<br />よろしいですか？
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-grey"
                  text
                  @click="isOpenDialog = false"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :loading="isProcessing"
                  :disabled="isProcessing"
                  color="#FFB9D6"
                  height="50"
                  @click="uploadImage"
                >
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-if="$route.query.modal === 'true'" class="row justify-space-between mt-6">
          <v-btn
            color="blue-grey"
            text
            @click="backToSetting"
          >
            設定画面に戻る
          </v-btn>
          <v-btn
            :disabled="!downloadURL"
            color="#FFE353"
            class="rounded-lg"
            height="51"
            @click="applySetting"
          >
            設定画面に反映させる
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import html2canvas from 'html2canvas'

export default Vue.extend({
  data() {
    return {
      imageFileName: '',
      text: '',
      downloadURL: '',
      verticalMove: 0,
      horizontalMove: 0,
      isProcessing: false,
      isOpenDialog: false,
    }
  },
  head() {
    return {
      title: '１コマ漫画ジェネレーター',
    }
  },
  computed: {
    isBlank(): boolean {
      return this.text === ''
    },
    styleObject(): { top: string, right: string } {
      return {
        top: `calc(7.5vw + ${this.verticalMove}px)`,
        right: `calc(7.5vw + ${this.horizontalMove}px)`
      }
    }
  },
  mounted() {
    this.getImage()
  },
  methods: {
    moveUp() {
      this.verticalMove -= 5
    },
    moveDown() {
      this.verticalMove += 5
    },
    moveLeft() {
      this.horizontalMove += 5
    },
    moveRight() {
      this.horizontalMove -= 5
    },
    getImage() {
      const number = this.$route.params.imageNumber
      this.imageFileName = `${this.getZeroPad(number, 2)}.png` || '01.png'
    },
    uploadImage() {
      this.isProcessing = true
      const storageRef = this.$fire.storage.ref()
      const randomString = this.getRandomString(8)
      const now = Date.now()
      html2canvas(this.$refs.result as HTMLElement).then((canvas) => {
        canvas.toBlob((blob) => {
          storageRef
            .child(`${randomString}${now}.png`)
            .put(blob!)
            .then((snapshot: any) => {
              snapshot.ref.getDownloadURL().then((downloadURL: string) => {
                this.downloadURL = downloadURL
                this.isProcessing = false
                this.isOpenDialog = false
              })
            })
        }, 'image/png')
      })
    },
    backToSetting() {
      this.$emit('closeModal')
      this.$router.go(-2);
    },
    applySetting() {
      this.$emit('getImageUrl', { imageUrl: this.downloadURL })
      this.$router.go(-2);
    },
    getRandomString(length: number) {
      const source = 'abcdefghijklmnopqrstuvwxyz'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += source[Math.floor(Math.random() * source.length)]
      }
      return result
    },
    getZeroPad(value: number, num: number) {
      const _num = typeof num !== 'undefined' ? num : 2
      return value.toString().padStart(_num, '0')
    },
  },
})
</script>

<style lang="scss" scoped>
$fontSize-m: calc(18px + 15 * (100vw - 360px) / 540);
$fontSize-l: calc(28px + 35 * (100vw - 360px) / 540);
$first-letter-circle: calc(50px + 35 * (100vw - 360px) / 540);
img {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
}
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30vh;
}
.manga-container {
  position: relative;
  display: inline-block;
}
.footer-container {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
.actions-container {
  background-color: #FFFFFF;
  padding: 15px;
}
.manga-text-outer {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  min-width: 40%;
  max-height: 70vw;
}
.manga-text {
  font-size: $fontSize-m;
  letter-spacing: 5px;
  writing-mode: vertical-rl;
  .first-letter {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: $first-letter-circle;
    height: $first-letter-circle;
    line-height: $first-letter-circle;
    border: 2px solid brown;
    border-radius: 50%;
    font-size: $fontSize-l;
    font-weight: bold;
    color: brown;
    padding: 8px;
    letter-spacing: 0;
  }
}
.credit-text {
  position: absolute;
  bottom: 5px;
  right: 10px;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 2px 2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, -2px -2px 0 #fff, 2px 0px 0 #fff, 0px 2px 0 #fff, -2px 0px 0 #fff, 0px -2px 0 #fff;
}
.input-wrap {
  width: 100%;
  max-width: 1080px;
}
.button-wrap {
  width: 100%;
  max-width: 288px;
}
textarea,
textarea:focus {
  font-size: 16px;
}
.button {
  font-size: 19px;
  box-shadow: 3px 4px 7px rgba(0, 0, 0, 0.15), inset 0px -8px 0px rgba(0, 0, 0, 0.21);
}
.footer-container a {
  color: #FFFFFF;
}
</style>

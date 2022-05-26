<template>
  <div class="generator-container">
    <div ref="result" class="manga-container">
      <img :src="`/images/manga/${imageFileName}`" alt="" />
      <div
        :key="`move${String(verticalMove + horizontalMove)}`"
        class="manga-text-outer"
        :style="imageFileName === '08.png' ? styleObjectLeft : styleObjectRight"
      >
        <div v-if="text" class="manga-text">
          <div v-for="(item, i) in textHtmlItems" :key="`html-${i}`" class="substr-letter">
            <span v-if="i === 0" class="first-letter vertical-letter">{{ text.substr(0, 1) }}</span>
            <div v-html="item" class="kaigyo-block"></div>
          </div>
        </div>
      </div>
      <p class="credit-text">イラスト：白目みさえ</p>
    </div>
    <div class="footer-container">
      <v-alert v-if="foundedNGWord" type="error" class="mt-6 text-center mx-3" dismissible>
        <p class="text-center">不適切なワードが含まれています</p>
        <p class="text-center caption mb-0">電話番号・メールアドレスも入力できません</p>
      </v-alert>
      <v-alert v-if="downloadURL" type="success" class="mt-6 text-center mx-3" dismissible>
        <p class="text-center">カードを保存しました！</p>
        <a :href="downloadURL" target="_blank">保存したカードを表示する</a>
      </v-alert>
      <div class="actions-container">
        <div class="input-wrap mt-4 mx-auto">
          <v-textarea
            v-model="text"
            rows="3"
            outlined
            clearable
            @click:clear="text = ''"
          />
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
          <v-btn
            :disabled="isBlank"
            color="#FFB9D6"
            class="button rounded-lg"
            block
            large
            height="61"
            @click.stop="openConfirm"
          >
            カードを保存
          </v-btn>
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
    <v-dialog
      v-model="isOpenConfirm"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6">
          カードを保存してゲームに使いますか？
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-grey"
            text
            @click="isOpenConfirm = false"
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
</template>

<script lang="ts">
import Vue from 'vue'
import html2canvas from 'html2canvas'

type DataType = {
  imageFileName: string
  text: string|null
  textHtmlItems: string[]
  downloadURL: string
  verticalMove: number
  horizontalMove: number
  isProcessing: boolean
  isOpenConfirm: boolean
  foundedNGWord: boolean
}

type MethodsType = {
  moveUp: () => void
  moveDown: () => void
  moveLeft: () => void
  moveRight: () => void
  getImage: () => void
  uploadImage: () => void
  backToSetting: () => void
  applySetting: () => void
  getRandomString: (length: number) => string
  getZeroPad: (value: number, num: number) => string
  openConfirm: () => void
  checkNGWord: () => void
}

type ComputedType = {
  isBlank: boolean
  styleObjectRight: { top: string, right: string }
  styleObjectLeft: { top: string, left: string }
}

export default Vue.extend<DataType, MethodsType, ComputedType, unknown>({
  data() {
    return {
      imageFileName: '',
      text: '',
      textHtmlItems: [],
      downloadURL: '',
      verticalMove: 0,
      horizontalMove: 0,
      isProcessing: false,
      isOpenConfirm: false,
      foundedNGWord: false,
    }
  },
  head() {
    return {
      title: 'カード作成',
    }
  },
  watch: {
    text(value): void {
      if (value) {
        const textSubstr = value.substr(1).split('\n')
        this.textHtmlItems = textSubstr.map((item: string) => {
          return item.split('').reduce((acc: string, v: any) => {
            return acc + `<span>${v.replace('ー', '｜')}</span>`
          }, '')
        })
      }
    },
  },
  computed: {
    isBlank(): boolean {
      return this.text === '' || this.text === null
    },
    styleObjectRight(): { top: string, right: string } {
      return {
        top: `calc(7.5vw + ${this.verticalMove}px)`,
        right: `calc(7.5vw + ${this.horizontalMove}px)`
      }
    },
    styleObjectLeft(): { top: string, left: string } {
      return {
        top: `calc(7.5vw + ${this.verticalMove}px)`,
        left: `-${this.horizontalMove}px`
      }
    },
  },
  mounted() {
    this.getImage()
  },
  methods: {
    moveUp(): void {
      this.verticalMove -= 5
    },
    moveDown(): void {
      this.verticalMove += 5
    },
    moveLeft(): void {
      this.horizontalMove += 5
    },
    moveRight(): void {
      this.horizontalMove -= 5
    },
    getImage(): void {
      this.imageFileName = `${this.getZeroPad(Number(this.$route.params.imageNumber), 2)}.png` || '01.png'
    },
    uploadImage(): void {
      this.isProcessing = true
      const storageRef = this.$fire.storage.ref()
      const randomString = this.getRandomString(8)
      const now = Date.now()
      html2canvas(this.$refs.result as HTMLElement).then((canvas) => {
        canvas.toBlob((blob) => {
          storageRef
            .child(`card${this.getZeroPad(Number(this.$route.params.imageNumber), 2)}/${now}${randomString}.png`)
            .put(blob!)
            .then((snapshot: any) => {
              snapshot.ref.getDownloadURL().then((downloadURL: string) => {
                this.downloadURL = downloadURL
                this.isProcessing = false
                this.isOpenConfirm = false
                this.text = ''
              })
            })
        }, 'image/png')
      })
    },
    backToSetting(): void {
      this.$emit('closeModal')
      this.$router.go(-2);
    },
    applySetting(): void {
      this.$emit('closeModal')
      this.$emit('created', { newCardCreated: true})
      this.$router.go(-2);
    },
    getRandomString(length: number): string {
      const source = 'abcdefghijklmnopqrstuvwxyz'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += source[Math.floor(Math.random() * source.length)]
      }
      return result
    },
    getZeroPad(value: number, num: number): string {
      const _num = typeof num !== 'undefined' ? num : 2
      return value.toString().padStart(_num, '0')
    },
    async openConfirm(): Promise<void> {
      await this.checkNGWord()
      if (!this.foundedNGWord) {
        this.isOpenConfirm = true
      }
    },
    async checkNGWord(): Promise<void> {
      this.foundedNGWord = false
      this.$axios.setHeader('Access-Control-Allow-Origin', 'https://mama-ms--pr84-feature-check-ng-wor-pje19be1.web.app') // test
      this.$axios.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      const checkRes = await this.$axios.$get(`https://api1-ap.webpurify.com/services/rest/?api_key=${this.$config.PROFANITY_FILTER_API_KEY}&method=webpurify.live.check&text=${this.text}&lang=jp&semail=1&sphone=1&slink=1&format=json`)
      this.foundedNGWord = checkRes.rsp.found > 0
    },
  },
})
</script>

<style lang="scss" scoped>
$fontSize-m: calc(18px + 15 * (100vw - 360px) / 580);
$fontSize-l: calc(28px + 35 * (100vw - 360px) / 580);
$first-letter-circle: calc(50px + 35 * (100vw - 360px) / 580);
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30vh;
}
.manga-container {
  position: relative;
  display: inline-block;
  background-color: #fff;
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
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex-flow: row-reverse;
  align-items: flex-start;
  font-size: $fontSize-m;
  letter-spacing: 5px;
  .first-letter {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: $fontSize-l;
    font-size: $fontSize-l;
    font-weight: bold;
    color: brown;
    padding: 8px;
    letter-spacing: 0;
    &::before {
      position: absolute;
      content: '';
      width: $first-letter-circle;
      height: $first-letter-circle;
      border: 2px solid brown;
      border-radius: 50%;
    }
  }
  .substr-letter {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }
  .kaigyo-block {
    display: inline-flex;
    flex-direction: column;
    line-height: 1.2;
  }
}
@include largerThan($medium) {
  .manga-text {
    font-size: 33px;
    .first-letter {
      line-height: 63px;
      font-size: 63px;
      &::before {
        width: 85px;
        height: 85px;
      }
    }
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

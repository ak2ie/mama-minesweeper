<template>
  <div class="generator-container">
    <div ref="result" class="manga-container">
      <img :src="`/images/manga/${imageFileName}`" alt="" />
      <div
        v-if="text"
        class="manga-text-outer"
        :style="{ top: `calc(7.5vw + ${verticalMove}px)`, right: `calc(7.5vw + ${horizontalMove}px)` }"
      >
        <p class="manga-text">
          <span class="first-letter">{{ text.substr(0, 1) }}</span>
          <span v-html="text.substr(1).replace('\n', '<br/>')"></span>
        </p>
      </div>
    </div>
    <div class="input-wrap mt-4">
      <v-textarea v-model="text" rows="3" outlined />
    </div>
    <div class="row justify-center">
      <div class="ma-2">
        <v-btn color="blue-grey" fab dark @click="moveUp">
          <v-icon dark>
            mdi-arrow-up-thick
          </v-icon>
        </v-btn>
      </div>
      <div class="ma-2">
        <v-btn color="blue-grey" fab dark @click="moveDown">
          <v-icon dark>
            mdi-arrow-down-thick
          </v-icon>
        </v-btn>
      </div>
      <div class="ma-2">
        <v-btn color="blue-grey" fab dark @click="moveLeft">
          <v-icon dark>
            mdi-arrow-left-thick
          </v-icon>
        </v-btn>
      </div>
      <div class="ma-2">
        <v-btn color="blue-grey" fab dark @click="moveRight">
          <v-icon dark>
            mdi-arrow-right-thick
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="button-wrap mt-6">
      <v-btn
        :loading="isProcessing"
        :disabled="isProcessing || isBlank"
        color="blue-grey"
        class="white--text"
        block
        large
        @click="uploadImage"
      >
        カード保存
        <v-icon right dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </div>
    <div v-if="downloadURL" class="mt-6">
      <p class="text-center">カードを保存しました！</p>
      <a :href="downloadURL" target="_blank">保存したカードを表示する</a>
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
              })
            })
        }, 'image/png')
      })
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
}
.manga-container {
  position: relative;
  display: inline-block;
}
.manga-text-outer {
  position: absolute;
  top: 7.5vw;
  right: 7.5vw;
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
</style>

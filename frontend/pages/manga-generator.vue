<template>
  <div>
    <div ref="result" class="manga-container">
      <img :src="`/manga/${imageFileName}`" alt="" />
      <div v-if="text" class="manga-text-outer">
        <p class="manga-text">
          <span class="first-letter">{{ text.substr(0, 1) }}</span>
          <span v-html="text.substr(1).replace('\n', '<br/>')"></span>
        </p>
      </div>
    </div>
    <div>
      <p>１コマにセリフをつけてみよう</p>
      <textarea v-model="text" rows="3" cols="50" />
    </div>
    <div>
      <button type="button" @click="uploadImage">画像を送信</button>
    </div>
    <div v-if="downloadURL">
      <a :href="downloadURL" target="_blank">{{ downloadURL }}</a>
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
    }
  },
  head() {
    return {
      title: '１コマ漫画ジェネレーター',
    }
  },
  mounted() {
    this.getImage()
  },
  methods: {
    getImage() {
      const randomNumber = this.getRandomNumber(7, 1)
      this.imageFileName = `${this.getZeroPad(randomNumber, 2)}.png` || '01.png'
    },
    uploadImage() {
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
    getRandomNumber(max: number, min: number = 0) {
      return Math.floor(Math.random() * (max - min) + min)
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
</style>

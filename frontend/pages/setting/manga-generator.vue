<template>
  <div>
    <ul class="manga-list">
      <li v-for="i in fileLength" :key="i" class="manga-item">
        <nuxt-link :to="{ path: `/setting/generator/${i}`, query: { modal: $route.query.modal } }">
          <img :src="`/images/manga/${getZeroPad(i, 2)}.webp`" alt="" />
        </nuxt-link>
      </li>
    </ul>
    <div v-if="$route.query.modal === 'true'" class="mt-6">
      <v-btn
        color="blue-grey"
        text
        @click="backToSetting"
      >
        設定画面に戻る
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      fileLength: 8,
    }
  },
  head() {
    return {
      title: 'カード作成',
    }
  },
  methods: {
    backToSetting() {
      this.$emit('closeModal')
      this.$router.go(-1)
    },
    getZeroPad(value: number, num: number) {
      const _num = typeof num !== 'undefined' ? num : 2
      return value.toString().padStart(_num, '0')
    },
  },
})
</script>

<style lang="scss" scoped>
.manga-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.manga-item {
  flex: 0 0 calc(100% / 3 - 12px);
  margin: 0 12px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
  background-color: #fff;
}
</style>

<template>
  <div>
    <ul class="manga-list">
      <li v-for="i in 7" :key="i" class="manga-item">
        <nuxt-link :to="{path: `/manga-generator/${i}`}">
          <img :src="`/images/manga/${getZeroPad(i, 2)}.png`" alt="" />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: '１コマ漫画ジェネレーター',
    }
  },
  methods: {
    getZeroPad(value: number, num: number) {
      const _num = typeof num !== 'undefined' ? num : 2
      return value.toString().padStart(_num, '0')
    },
  },
})
</script>

<style lang="scss" scoped>
img {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
}
.manga-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}
.manga-item {
  flex: 0 0 calc(100% / 3 - 12px);
  margin: 0 12px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
</style>

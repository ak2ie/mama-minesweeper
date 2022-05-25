<template>
  <div>
    <div v-for="(imageBlock, i) in images" :key="`imageBlock-${i}`">
      <div v-if="currentCardTypeIndex === i">
        <ul class="card-list">
          <li
            v-for="(image, j) in imageBlock"
            :key="`image-${j}`"
            class="card-item"
            :class="{'cell-selected': image.cellNumber}"
            @click.stop="$emit('set', j, image)"
          >
            <img :src="image.imageUrl" alt="" />
            <div v-if="image.cellNumber" class="cell-number">{{ image.cellNumber }}</div>
          </li>
        </ul>
        <v-btn
          v-if="!!nextPageTokenItems[i]"
          color="#FFE353"
          class="button rounded-lg"
          block
          large
          height="61"
          @click="$emit('more', i)"
        >
          もっと表示
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    images: {
      type: Array,
      required: true
    },
    currentCardTypeIndex: {
      type: Number,
      required: true
    },
    nextPageTokenItems: {
      type: Array,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.card-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.card-item {
  position: relative;
  flex: 0 0 calc(100% / 3 - 12px);
  margin: 0 12px 12px 0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background-color: #fff;
  &:nth-child(3n) {
     margin-right: 0;
   }
  &.cell-selected {
     border: 5px solid rebeccapurple;
   }
  .cell-number {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: rebeccapurple;
    border-radius: 50%;
    border: 3px solid rebeccapurple;
    background-color: #fff;
  }
}
</style>

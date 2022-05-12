<template>
  <div class="row mb-3">
    <div v-for="(cell, index) in cells" :key="`cell-${index}`" class="col-4 pa-0 themed-grid-col">
      <v-icon v-if="cell.isBomb" class="bomb-icon">mdi-bomb</v-icon>
      <v-img
        :src="cell.imageUrl"
        contain
        aspect-ratio="1"
        lazy-src="/images/index-logo-gray.png"
        @click.stop="$emit('showImage', cell)"
      >
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey darken-3"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <div class="d-block d-sm-flex justify-space-around text-center">
        <v-btn class="ma-1" @click.stop="$emit('changeImage', cell)">
          <v-icon>mdi-image</v-icon>
          <span>{{ cell.cellNumber }}</span>
        </v-btn>
        <v-btn class="ma-1" :color="cell.isBomb ? 'primary' : 'secondary'" @click="$emit('toggleBomb', cell)">
          <v-icon>mdi-bomb</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    cells: {
      type: Array,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.themed-grid-col {
  background-color: rgba(86, 61, 124, .15);
  border: 1px solid rgba(86, 61, 124, .2);
  position: relative;
}
.bomb-icon {
  position: absolute;
  top: 10%;
  left: 10%;
  padding: 5%;
  color: white;
  background-color: #FF5CBE;
  border-radius: 50%;
  text-align: center;
  border: 2px solid white;
  z-index: 1;
}
</style>

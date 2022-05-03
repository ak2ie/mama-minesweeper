<template>
  <div class="minesweeper-cell" :class="getClass()">
    <v-img v-if="!cell.isOpen" :src="cell.image" contain class="cell-img">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-img
      v-else
      :src="cell.image"
      gradient="to top right, rgba(255,255,255,.80), rgba(255,255,255,.80)"
      contain
      class="cell-img"
    >
    </v-img>
    <div v-if="cell.isOpen && cell.hasBomb" class="bomb-icon">
      <img src="/images/bomb_icon.png" width="20" height="20" />
    </div>
    <div v-if="cell.hasFlag">&#9873;</div>
  </div>
</template>

<script>
export default {
  name: 'minesweeper-cell',
  props: {
    cell: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getClass() {
      const { cell } = this
      if (cell.isOpen && cell.hasBomb) {
        return 'minesweeper-bomb'
      }
      if (cell.isOpen) {
        return 'minesweeper-open'
      }
      if (cell.hasFlag) {
        return 'minesweeper-flag'
      }
      return ''
    },
  },
}
</script>

<style lang="scss">
.minesweeper {
  &-cell {
    align-items: center;
    background: #efefef;
    border: 1px white solid;
    color: #2c3e50;
    cursor: pointer;
    display: flex;
    font-size: 1.3em;
    justify-content: center;
    min-height: 35px;
    min-width: 35px;
    padding: 10px 5px;
    position: relative;
  }

  &-bomb > div {
    border: 5px #c0392b solid;
  }

  &-bomb > div.bomb-icon {
    position: absolute;
    top: 15%;
    right: 10%;
    background-color: yellow;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    border: none;
  }

  &-open {
    background: rgba(0, 0, 0, 0.05);
  }

  &-flag {
    background: #2ecc71;
  }

  .cell-img {
    border-radius: 8px;
  }
}
</style>
<template>
  <div class="minesweeper">
    <div class="minesweeper-status">
      <div class="minesweeper-bombcount">
        {{ bombCount }}
      </div>
      <a href="#" @click.prevent="initGrid"> &#9786; </a>
      <minesweeper-timer
        ref="timer"
        class="minesweeper-timer"
        :finished="finished"
      ></minesweeper-timer>
    </div>

    <div class="minesweeper-grid" :style="getGridStyle()">
      <minesweeper-cell
        v-for="(cell, i) in grid"
        :key="i"
        :cell="cell"
        @click.native="openImage(cell, i)"
        @click.right.native="addFlag(cell)"
        @dblclick.native.prevent="doubleClick(cell, i)"
        @contextmenu.native.prevent
      >
      </minesweeper-cell>
    </div>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title v-show="!finished" class="text-h5 grey lighten-2">
          これは地雷？
        </v-card-title>

        <v-card-text>
          <v-img
            v-if="openTargetCell !== null"
            :src="openTargetCell.image"
            contain
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!finished" color="primary" text @click="openCell()"
            >地雷ではない</v-btn
          >
          <v-btn v-else color="primary" text @click="dialog = false"
            >閉じる</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MinesweeperCell from './MinesweeperCell.vue'
import MinesweeperTimer from './MinesweeperTimer.vue'

export default {
  name: 'minesweeper-game',
  components: {
    MinesweeperCell,
    MinesweeperTimer,
  },
  props: {
    cols: {
      type: Number,
      default: 9,
    },
    rows: {
      type: Number,
      default: 9,
    },
    bombs: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      bombCount: 0,
      finished: false,
      started: false,
      won: false,
      grid: [],
      dialog: false,
      openTargetCell: null,
    }
  },
  mounted() {
    this.initGrid()
  },
  methods: {
    getGridStyle() {
      const { cols } = this
      return `grid-template-columns: repeat(${cols}, 1fr);`
    },
    initGrid() {
      let { bombs } = this
      const { cols, rows } = this
      const size = rows * cols
      const grid = []
      const imagePaths = [
        '025.png',
        '029.png',
        '037.png',
        '040.png',
        '050.png',
        '053.png',
        '054.png',
        '056.png',
        '057.png',
        '101.png',
        '107.png',
        '114.png',
        '120.png',
        '124.png',
        '131.png',
        '137.png',
        '139.png',
        '159.png',
        '60.png',
        '61.png',
        '62.png',
        '66.png',
        '67.png',
        '70.png',
        '72.png',
        '76.png',
        '79.png',
      ]
      if (bombs > size) {
        console.log('more bombs than space on the grid!')
        return
      }
      for (let i = 0; i < size; i += 1) {
        grid.push({
          hasBomb: false,
          isOpen: false,
          hasFlag: false,
          bombCount: 0,
          neighborhood: null,
          image: `images/${imagePaths[i]}`,
        })
      }
      while (bombs > 0) {
        const num = Math.floor(Math.random() * size)
        if (grid[num].hasBomb === false) {
          bombs -= 1
          grid[num].hasBomb = true
        }
      }
      this.grid = grid
      this.finished = true
      this.$nextTick(() => {
        this.finished = false
      })
      this.won = false
      this.bombCount = this.bombs
    },
    haveWeWon() {
      if (this.finished) {
        return
      }
      const remainingGrid = this.grid.find((g) => !g.isOpen && !g.hasFlag)
      if (!remainingGrid) {
        this.finished = true
        this.won = true
      } else {
        // 開けてない かつ 旗も立てていないマスがある場合
        const remainingBlankGrid = this.grid.find(
          (g) => !g.isOpen && !g.hasBomb
        )
        if (!remainingBlankGrid) {
          // 開けていないマスがすべて地雷の場合
          this.grid.forEach((checkCell) => {
            if (checkCell.hasBomb) {
              checkCell.isOpen = true
            }
          })
          this.finished = true
          this.won = true
        }
      }
    },
    addFlag(cell) {
      if (this.finished) {
        return
      }
      if (cell.isOpen) {
        return
      }
      cell.hasFlag = !cell.hasFlag
      const { grid } = this
      const flagCount = grid.reduce((accumulator, currentValue) => {
        if (currentValue.hasFlag) {
          return accumulator + 1
        }
        return accumulator
      }, 0)
      this.bombCount = this.bombs - flagCount
      this.haveWeWon()
    },
    doubleClick(cell, i) {
      if (this.finished) {
        return
      }
      if (cell.isOpen === false) {
        return
      }
      this.setNeighborhood(cell, i)
      if (!cell.bombCount) {
        return
      }

      const { grid } = this
      let flagCount = 0
      cell.neighborhood.forEach((j) => {
        if (grid[j].hasFlag) {
          flagCount += 1
        }
      })
      if (flagCount === cell.bombCount) {
        this.checkNeighborhood(cell, true)
      }
    },
    clickCell(cell, i) {
      if (this.finished) {
        return
      }
      if (cell.hasFlag) {
        return
      }
      if (cell.isOpen) {
        return
      }
      if (cell.hasBomb) {
        // todo bomb!
        const { grid } = this
        grid.forEach((checkCell) => {
          if (checkCell.hasBomb) {
            checkCell.isOpen = true
          }
        })
        this.finished = true
        return
      }

      // this.setNeighborhood(cell, i);
      cell.isOpen = true
      // this.checkNeighborhood(cell)
      this.haveWeWon()
    },
    checkNeighborhood(cell, force) {
      if (cell.bombCount !== 0 && force !== true) {
        return
      }

      const { grid } = this
      cell.neighborhood.forEach((i) => {
        this.clickCell(grid[i], i)
      })
    },
    setNeighborhood(cell, i) {
      if (cell.neighborhood !== null) {
        return
      }
      const { grid } = this
      const neighborhood = []
      let bombCount = 0
      for (let x = -1; x < 2; x += 1) {
        for (let y = -1; y < 2; y += 1) {
          const cellIndex = this.getIndex(i, x, y)
          if (cellIndex !== false) {
            neighborhood.push(cellIndex)
            if (grid[cellIndex].hasBomb) {
              bombCount += 1
            }
          }
        }
      }
      cell.bombCount = bombCount
      cell.neighborhood = neighborhood
    },
    getIndex(i, x, y) {
      const { cols, rows } = this
      if (x === 0 && y === 0) {
        return false
      }
      if ((i % cols) + x < 0 || (i % cols) + x >= cols) {
        return false
      }
      if (Math.floor(i / cols) + y < 0 || Math.floor(i / cols) + y >= rows) {
        return false
      }
      return i + (y * cols + x)
    },
    /**
     * 画像を拡大表示する
     */
    openImage(cell, i) {
      this.dialog = true
      this.openTargetCell = cell
      if (!this.started) {
        this.$refs.timer.initTimer()
        this.started = true
      }
    },
    openCell() {
      this.clickCell(this.openTargetCell, 0)
      this.dialog = false
    },
  },
  watch: {
    rows() {
      this.initGrid()
    },
    cols() {
      this.initGrid()
    },
    bombs() {
      this.initGrid()
    },
  },
}
</script>

<style lang="scss">
.minesweeper {
  &-status {
    display: flex;
    justify-content: space-between;
    padding: 1rem;

    > * {
      flex: 1;
      text-align: center;
    }
  }

  &-grid {
    user-select: none;
    position: relative;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-auto-rows: 1fr;

    &:before {
      content: '';
      width: 0;
      padding-bottom: 100%;
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }

    > *:first-child {
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }
  }
}
</style>
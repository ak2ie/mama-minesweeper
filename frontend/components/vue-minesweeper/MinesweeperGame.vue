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

    <!-- マインスイーパ -->
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

    <!-- 完了時アニメーション -->
    <div v-if="finishedWithWin" id="complete-success">
      <img src="/images/cracker-animated-1.gif" />
    </div>
    <div v-if="finishedWithLose" id="complete-fail">
      <img src="/images/Bomb_300_Octree_64bit.gif" />
    </div>

    <!-- マスを開くときのダイアログ -->
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

    <!-- シェアボタン -->
    <v-dialog v-model="shareDialog" width="500" hide-overlay="false">
      <v-card>
        <v-card-text id="share-button">
          <v-btn color="info" large :href="twitterText"
            >結果をシェアする<v-icon right>mdi-twitter</v-icon></v-btn
          >
        </v-card-text>
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
  data() {
    return {
      bombCount: 0,
      finished: false,
      started: false,
      won: false,
      grid: [],
      dialog: false,
      openTargetCell: null,
      bombs: 0,
      cols: 0,
      rows: 0,
      finishedWithWin: false,
      finishedWithLose: false,
      twitterText: '',
      shareDialog: false,
    }
  },
  computed: {
    // eslint-disable-next-line object-shorthand
    panels: function () {
      return this.$accessor.GridManager.grid.panels
    },
  },
  mounted() {},
  methods: {
    getGridStyle() {
      const { cols } = this
      return `grid-template-columns: repeat(${cols}, 1fr);`
    },
    initGrid() {
      this.bombs = this.$accessor.GridManager.grid.BombsCount()
      this.cols = this.$accessor.GridManager.grid.ColumnCount()
      this.rows = this.$accessor.GridManager.grid.RowCount()
      const grid = []
      for (let i = 0; i < this.$accessor.GridManager.grid.panels.length; i++) {
        grid.push({
          hasBomb: this.$accessor.GridManager.grid.panels[i].isBomb,
          isOpen: false,
          hasFlag: false,
          bombCount: 0,
          neighborhood: null,
          image: this.$accessor.GridManager.grid.panels[i].imageUrl,
        })
      }
      this.grid = grid
      this.finished = true
      this.$nextTick(() => {
        this.finished = false
      })
      this.won = false
      this.bombCount = this.bombs
      this.setTwitterText()
    },
    haveWeWon() {
      if (this.finished) {
        return
      }
      const remainingGrid = this.grid.find((g) => !g.isOpen && !g.hasFlag)
      if (!remainingGrid) {
        this.finished = true
        this.won = true
        this.showCompleteAnimation()
        this.setTwitterText()
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
          this.showCompleteAnimation()
          this.setTwitterText()
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
        this.showCompleteAnimation()
        this.setTwitterText()
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
    showCompleteAnimation() {
      if (this.won) {
        this.finishedWithWin = true
        setTimeout(() => {
          this.finishedWithWin = false
          this.shareDialog = true
        }, 5000)
      } else {
        this.finishedWithLose = true
        setTimeout(() => {
          this.finishedWithLose = false
          this.shareDialog = true
        }, 4000)
      }
    },
    setTwitterText() {
      const template = `https://twitter.com/intent/tweet?text=[TEXT]&url=${window.location.href}&hashtags=マママインスイーパー`
      if (this.started) {
        if (this.won) {
          this.twitterText = template.replace(
            '[TEXT]',
            `パートナーが思っていることはだいたい分かってます！\n記録：${this.$refs.timer.theTime}秒`
          )
        } else {
          this.twitterText = template.replace(
            '[TEXT]',
            `パートナーの思っていることが分かりませんでした...😢\n記録：${this.$refs.timer.theTime}秒`
          )
        }
      } else {
        this.twitterText = template.replace(
          '[TEXT]',
          'パートナーとユーモアのあるコミュニケーションをとってみよう！'
        )
      }
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
    panels() {
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

.minesweeper {
  position: relative;
}

#complete-success {
  position: absolute;
  top: 0px;
  left: 0;

  img {
    width: 100%;
  }
}

#complete-fail {
  img {
    position: absolute;
    top: 0;
    left: -20px;
    @media screen and (min-width: 500px) {
      left: 0px;
    }
    width: 100%;
    height: 100%;
  }
}

#share-button {
  min-height: 100px;
  text-align: center;
  padding-top: 20px;
}
</style>
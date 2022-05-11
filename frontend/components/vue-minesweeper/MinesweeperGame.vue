<template>
  <div class="minesweeper">
    <div class="minesweeper-status">
      <div class="timer">
        <div class="timer-title">経過時間</div>
        <span class="timer-time">
          <minesweeper-timer
            ref="timer"
            class="minesweeper-timer"
            :finished="finished"
          ></minesweeper-timer
        ></span>
      </div>
      <div class="bombcount">
        <div class="bombcount-title">
          <img src="/images/bomb_icon.png" width="16" height="16" />
          地雷の数
        </div>
        <span class="bombcount-num">{{ bombCount }}コ</span>
      </div>
    </div>

    <!-- マインスイーパ -->
    <div class="minesweeper-grid" :style="getGridStyle()">
      <minesweeper-cell
        v-for="(cell, i) in grid"
        :key="i"
        :cell="cell"
        @click.native="openImage(cell, i)"
        @click.right.native="addFlag(cell, true)"
        @contextmenu.native.prevent
      >
      </minesweeper-cell>
    </div>

    <!-- 完了時アニメーション -->
    <div v-if="finishedWithWin" id="complete-success">
      <img src="/images/cracker-animated-1.gif" />
    </div>
    <!-- プリロード -->
    <div v-show="finishedWithLose" id="complete-fail">
      <!-- 2回目以降もアニメーション再生 -->
      <img :src="'/images/Bomb_300_Octree_64bit_1time.gif?' + randomText" />
    </div>

    <!-- リセットボタン -->
    <div v-if="showResetButton" class="reset-button" @click="initGrid()">
      <v-btn color="#83D2FF" class="button rounded-lg" x-large width="200"
        >もう一度</v-btn
      >
    </div>

    <v-snackbar v-model="snackbar" absolute tile color="orange darken-2">
      <span class="text-subtitle-1">
        地雷ではないマスが残っています。<br />マスを開いて「地雷ではない」を押してください。
      </span>
    </v-snackbar>

    <!-- マスを開くときのダイアログ -->
    <v-dialog
      v-model="dialog"
      width="500"
      content-class="elevation-0 dialog-outer"
    >
      <v-img
        v-if="openTargetCell !== null"
        :src="openTargetCell.image"
        contain
        class="dialog-img"
      />

      <v-btn
        v-if="!finished && openTargetCell !== null && !openTargetCell.isOpen"
        color="#83D2FF"
        class="button rounded-lg mt-4"
        x-large
        width="80%"
        @click="openCell()"
        >地雷ではない</v-btn
      >
      <v-btn
        v-if="!finished && openTargetCell !== null && !openTargetCell.isOpen"
        color="#ff8f83"
        class="button rounded-lg mt-4"
        x-large
        width="80%"
        @click="setFlag(openTargetCell)"
        >地雷のはず</v-btn
      >
    </v-dialog>

    <!-- シェアボタン -->
    <v-dialog
      v-model="shareDialog"
      width="500"
      @click:outside="showResetButton = true"
    >
      <v-card>
        <v-card-text id="share-button">
          <span class="text-subtitle-1 pr-2">経過時間</span
          ><span class="text-h4">{{ time }}</span>
          <br />
          <p class="text-subtitle-1">
            {{ resultText }}
          </p>
          <v-btn
            color="#83D2FF"
            class="button rounded-lg"
            x-large
            width="200"
            :href="twitterText"
            target="_blank"
            >シェアする</v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="text-right"
            @click="
              shareDialog = false
              showResetButton = true
            "
            >閉じる</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 使い方 -->
    <v-dialog v-model="showTutorial" max-width="500">
      <v-card>
        <v-card-text>
          <v-carousel
            v-model="tutorialCurrent"
            :continuous="false"
            hide-delimiters
            :v-model="0"
            progress
            progress-color="#83D2FF"
            :max="tutorialMax"
            height="250"
          >
            <v-carousel-item>
              <div class="py-3" justify="center">
                <p class="text-h5">
                  パートナーの嫌なことが地雷になっているマインスイーパーです。
                </p>
                <p class="text-h5">
                  地雷を避けて、マスを「地雷ではない」ボタンで開けていきましょう。<br />
                  全部開けられたら成功です。
                </p>
              </div>
            </v-carousel-item>
            <v-carousel-item>
              <v-sheet>
                <div class="py-3" justify="center">
                  <p class="text-h5">
                    地雷のマスで「地雷ではない」ボタンを押してしまうと、ゲームオーバーです。
                  </p>
                </div>
              </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
              <v-sheet class="fill-height">
                <div
                  class="py-3 d-flex flex-column justify-space-between fill-height"
                >
                  <p class="text-h5">
                    地雷だと思ったら「地雷のはず」ボタンを押してください。<br />
                    地雷をマークできます。
                  </p>
                  <p class="text-subtitle1 text-center">
                    マスの<span v-if="isTouchDevice">長押し</span
                    ><span v-else>右クリック</span
                    >でもマークを設定・解除できます
                  </p>
                </div>
              </v-sheet>
            </v-carousel-item>

            <v-carousel-item>
              <v-sheet>
                <div class="py-3" justify="center">
                  <p class="text-h5">
                    地雷以外のすべてのマスを開けられるように遊んでみましょう。
                  </p>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-show="tutorialCurrent != tutorialMax"
            text
            class="text-right"
            @click="showTutorial = false"
            >スキップ</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            v-show="tutorialCurrent == tutorialMax"
            color="#83D2FF"
            class="text-right text-subtitle-1"
            large
            width="130"
            @click="showTutorial = false"
            >はじめる</v-btn
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
      /**
       * twitter投稿用のURL
       */
      twitterText: '',
      /**
       * 遊んだ結果のテキスト
       */
      resultText: '',
      shareDialog: false,
      showResetButton: false,
      /**
       * gifアニメ再生用
       */
      randomText: 'random',
      snackbar: false,
      showTutorial: true,
      tutorialCurrent: 0,
      tutorialMax: 3,
      isInitProcessing: false,
      isTouchDevice: false,
      isShowRemainNotBomb: false
    }
  },
  computed: {
    // eslint-disable-next-line object-shorthand
    panels: function () {
      return this.$accessor.GridManager.grid.panels
    },
    // eslint-disable-next-line object-shorthand
    time: function () {
      if (this.started) {
        return this.$refs.timer.theTimeMMSS
      } else {
        return ''
      }
    },
  },
  mounted() {
    const touchEvent = window.ontouchstart;
    const touchPoints = navigator.maxTouchPoints;
  
    if( touchEvent !== undefined && touchPoints > 0 ) {
      this.isTouchDevice = true
    }
  },
  methods: {
    getGridStyle() {
      const { cols } = this
      return `grid-template-columns: repeat(${cols}, 1fr);`
    },
    async initGrid() {
      if (this.isInitProcessing) {
        return;
      }
      this.bombs = this.$accessor.GridManager.grid.BombsCount()
      this.cols = this.$accessor.GridManager.grid.ColumnCount()
      this.rows = this.$accessor.GridManager.grid.RowCount()
      this.isInitProcessing = true
      this.showResetButton = false
      if (this.grid.length === 0) {
        const grid = []
        const imgGetPromises = []
        for (let i = 0; i < this.$accessor.GridManager.grid.panels.length; i++) {
          const t = this
        
          imgGetPromises.push(new Promise(function(resolve) {
            t.$axios({
              method: 'get',
              url: t.$accessor.GridManager.grid.panels[i].imageUrl,
              responseType: 'blob'
            }).then(response => {
              const reader = new FileReader();
              reader.onloadend = function() {
                grid.push({
                  hasBomb: t.$accessor.GridManager.grid.panels[i].isBomb,
                  isOpen: false,
                  hasFlag: false,
                  bombCount: 0,
                  neighborhood: null,
                  image: reader.result
                })
                resolve('')
              }
              reader.readAsDataURL(response.data);
            })
          }))
        }
        await Promise.all(imgGetPromises)
        this.grid = grid
      } else {
        for (let i = 0; i < this.grid.length; i++) {
          this.grid[i].isOpen = false
          this.grid[i].hasFlag = false
        }
      }
      this.finished = true
      this.$nextTick(() => {
        this.finished = false
      })
      this.won = false
      this.bombCount = this.bombs
      this.setShareText()
      this.started = false
      this.$refs.timer.resetTimer()
      this.randomText = new Date().getTime()
      this.isInitProcessing = false
    },
    haveWeWon() {
      if (this.finished) {
        return
      }
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
        this.won = true
        this.finished = true
        this.showCompleteAnimation()
        this.setShareText()
      }
    },
    /**
     * フラグを立てる
     * @param {cell} 操作対象のマス
     * @param {isToggle} フラグを切り替えるならtrue、設定値に関わらずフラグを立てるならfalse
     */
    addFlag(cell, isToggle) {
      if (this.finished) {
        return
      }
      if (cell.isOpen) {
        return
      }
      cell.hasFlag = isToggle ? !cell.hasFlag : true
      const isOpenORFlag = this.grid.every(cell => cell.isOpen || cell.hasFlag)
      if(isOpenORFlag && !this.isShowRemainNotBomb) {
        this.snackbar = true
        this.isShowRemainNotBomb = true
      }
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
        cell.hasFlag = false
      }
      if (cell.isOpen) {
        return
      }
      if (cell.hasBomb) {
        cell.isOpen = true
        this.finished = true
        this.showCompleteAnimation()
        this.setShareText()
        return
      }

      // this.setNeighborhood(cell, i);
      cell.isOpen = true
      // this.checkNeighborhood(cell)
      this.haveWeWon()
      const isOpenORFlag = this.grid.every(cell => cell.isOpen || cell.hasFlag)
      const remainingBlankGrid = this.grid.find(
          (cell) => !cell.isOpen && !cell.hasBomb
        )
      if(isOpenORFlag && remainingBlankGrid && !this.isShowRemainNotBomb) {
        this.snackbar = true
        this.isShowRemainNotBomb = true
      }
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
        }, 3000)
      }
    },
    /**
     * 遊んだ結果シェア用のテキスト
     */
    setShareText() {
      const template = `https://twitter.com/intent/tweet?text=[TEXT]&url=${window.location.href}&hashtags=マママインスイーパー`
      if (this.started) {
        if (this.won) {
          this.resultText = 'パートナーが思っていることはだいたい分かってます！'
          this.twitterText = template.replace(
            '[TEXT]',
            `${this.resultText}\n経過時間 ${this.time}`
          )
        } else {
          this.resultText =
            'パートナーの思っていることが分かりませんでした...😢'
          this.twitterText = template.replace(
            '[TEXT]',
            `${this.resultText}\n経過時間 ${this.time}`
          )
        }
      } else {
        this.twitterText = template.replace(
          '[TEXT]',
          'パートナーとユーモアのあるコミュニケーションをとってみよう！'
        )
      }
    },
    /**
     * フラグを立てる
     */
    setFlag(cell) {
      this.addFlag(cell, false)
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
    panels() {
      this.initGrid()
    },
  },
}
</script>

<style lang="scss">
.minesweeper {
  &-status {
    padding: 1rem 0;

    > * {
      text-align: center;
    }
  }

  &-grid {
    user-select: none;
    position: relative;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    //grid-auto-rows: 1fr;
    border-left: 1px #000000 solid;
    border-top: 1px #000000 solid;

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

  &-cell {
    border-right: 1px #000000 solid;
    border-bottom: 1px #000000 solid;
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

/* 経過時間 */
.timer {
  &-title {
    font-size: 0.9em;
  }
  &-time {
    font-size: 1.8em;
  }
}

/* 地雷の数 */
.bombcount {
  position: absolute;
  right: 20px;
  top: 1rem;
  &-title {
    font-size: 0.9em;

    & > img {
      margin-right: 5px;
      vertical-align: text-top;
    }
  }

  &-num {
    font-size: 1.8em;
  }
}

.dialog-outer {
  text-align: center;
  box-shadow: none;
}

/* マスをクリックして拡大表示した画像 */
.dialog-img {
  border-radius: 20px;
}

.dialog-bomb-btn {
  color: #ffffff;
  margin: 20px 0 0 0;
  border-radius: 16px;
}

/* リセットボタン */
.reset-button {
  text-align: center;
  margin-top: 30px;
  background-color: #ffffff;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 15px 0;
}

.button {
  width: 160px;
  font-size: 19px;
  box-shadow: 3px 4px 7px rgba(0, 0, 0, 0.15),
    inset 0px -8px 0px rgba(0, 0, 0, 0.21);
}
</style>
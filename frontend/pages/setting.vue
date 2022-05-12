<template>
  <div class="wrapper">
    <v-dialog
      v-model="imageSelectModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="#B5E58E">
        <v-card-title class="text-h5 grey lighten-2">
          カードを選んでね
        </v-card-title>
        <v-card-text class="pa-4">
          <ul class="card-type-list">
            <li v-for="(item, i) in cardType" :key="`cardType-${i}`" class="card-type-item">
              <v-btn
                :color="currentCardTypeIndex === i ? 'white' : '#A0CF79'"
                rounded
                @click="selectCardType(i)"
              >
                {{ item.label }}
              </v-btn>
            </li>
          </ul>
          <div v-if="isLoadingImageItems" class="text-center">
            <v-progress-circular
              :size="70"
              :width="7"
              color="purple darken-2"
              indeterminate
            />
          </div>
          <div v-else>
            <div v-for="(imageBlock, i) in images" :key="`imageBlock-${i}`">
              <div v-if="currentCardTypeIndex === i">
                <ul class="card-list">
                  <li
                    v-for="(image, j) in imageBlock"
                    :key="`image-${j}`"
                    class="card-item"
                    :class="{'cell-selected': image.cellNumber}"
                    @click="set(j, image)"
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
                  @click="more(i)"
                >
                  もっと表示
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="secondary" @click="hide">
            もどる
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click.stop="openMangaGeneratorModal">
            新しいカードを作る
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="confirmModal"
      width="70%"
      min-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="grey lighten-2">
          ゲームに設定する
        </v-card-title>
        <v-card-text class="mt-4 text-center">
          <img :src="selectImage ? selectImage.imageUrl : null" alt="" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-grey"
            text
            @click="confirmModal = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="#FFE353"
            height="50"
            @click="saveImage"
          >
            このカードで決定！
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="mangaGeneratorModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="#FFB9D6">
        <v-card-title class="text-h5 grey lighten-2">
          新しいカードを作る
        </v-card-title>
        <v-card-text class="py-4">
          <nuxt-child
            v-if="$route.query.modal === 'true'"
            @created="getNewCard($event)"
            @closeModal="mangaGeneratorModal = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showImageModal"
    >
      <v-card>
        <v-img
          :src="selectCell ? selectCell.imageUrl : null"
          contain
          aspect-ratio="1"
          lazy-src="/images/index-logo-gray.png"
          @click="showImageModal = false"
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
      </v-card>
    </v-dialog>

        <nuxt-child v-if="$route.query.modal === 'false'" />

        <!-- Page Content  -->
        <div v-if="$route.query.modal == null" id="content">
          <div class="container">
            <div class="row mb-3" >
              <div v-for="(cell, index) in cells" :key="`cell-${index}`" class="col-4 pa-0 themed-grid-col">
                <v-icon v-if="cell.isBomb" class="bomb-icon">mdi-bomb</v-icon>
                <v-img
                  :src="cell.imageUrl"
                  contain
                  aspect-ratio="1"
                  lazy-src="/images/index-logo-gray.png"
                  @click.stop="showImage(cell)"
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
                  <v-btn class="ma-1" @click.stop="changeImage(cell)">
                    <v-icon>mdi-image</v-icon>
                    <span>{{ cell.cellNumber }}</span>
                  </v-btn>
                  <v-btn class="ma-1" :color="cell.isBomb ? 'primary' : 'secondary'" @click="toggleBomb(cell)">
                    <v-icon>mdi-bomb</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="my-3 px-3">
              <v-alert v-if="url" type="success" dismissible>
                URL:<a :href="url">{{url}}</a>
                <span v-if="!isNavigatorShareButton">
                  コピー：
                  <v-btn @click="share">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </span>
                <span v-if="isNavigatorShareButton">
                  シェア：
                  <v-btn @click="share">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </span>
              </v-alert>
            </div>
            <div class="footer-actions">
              <v-btn
                class="button rounded-lg"
                color="#FFE353"
                x-large
                depressed
                height="73"
                @click="changeImageRandom()"
              >
                <span>ランダム配置</span>
              </v-btn>
              <v-btn
                :loading="isProcessing"
                :disabled="isProcessing"
                color="#FFB9D6"
                class="button rounded-lg"
                x-large
                depressed
                height="73"
                @click="make()">
                <span>できあがり</span>
              </v-btn>
            </div>
          </div>
        </div>
        <!-- Page Content  -->
        <v-snackbar
          v-model="snackbar"
          :color="snackbarType"
          :multi-line="true"
        >
          {{ snackbarMsg }}
          <template #action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
    </div> <!-- wrapper -->
</template>

<script lang="ts">
import Vue from 'vue'

interface CellData {
  cellNumber: number,
  imageUrl: string|undefined,
  isBomb: boolean,
}

interface ImageData {
  imageUrl: string|undefined,
  cellNumber: number|null,
}

interface CardTypeData {
  label: string,
  prefix: string,
}

interface DataType {
  cells: CellData[],
  initialImages: ImageData[],
  images: (ImageData|unknown)[][],
  nextPageTokenItems: (string|null)[][],
  currentCardTypeIndex: number,
  imageSelectModal: boolean,
  confirmModal: boolean,
  mangaGeneratorModal: boolean,
  showImageModal: boolean,
  selectImage: ImageData|undefined,
  selectImageIndex: number,
  selectCell: undefined|CellData,
  url: undefined|string,
  errorMessage: undefined|string,
  isProcessing: boolean,
  isLoadingImageItems: boolean,
  changedCardRandom: boolean,
  newCardCreated: boolean,
  currentImageIndex: number,
  isNavigatorShareButton: boolean,
  snackbar: boolean,
  snackbarType: string,
  snackbarMsg: string,
  cardType: CardTypeData[],
}

export default Vue.extend({
  data():DataType {
    const cells = [];
    const CELL_LENGTH = 9;
    for(let i = 0; i < CELL_LENGTH; i++) {
      cells.push({
        cellNumber: i + 1,
        imageUrl: undefined,
        isBomb: false
      });
    }

    return {
      cells,
      initialImages: [],
      images: [],
      nextPageTokenItems: [],
      currentCardTypeIndex: 0,
      imageSelectModal: false,
      confirmModal: false,
      mangaGeneratorModal: false,
      showImageModal: false,
      selectImage: undefined,
      selectImageIndex: 0,
      selectCell: undefined,
      url: undefined,
      errorMessage: undefined,
      isProcessing: false,
      isLoadingImageItems: false,
      changedCardRandom: false,
      newCardCreated: false,
      currentImageIndex: 0,
      isNavigatorShareButton: false,
      snackbar: false,
      snackbarType: "success",
      snackbarMsg: "",
      cardType: [
        {
          label: 'グッタリ',
          prefix: 'card01',
        },
        {
          label: 'メラメラ１',
          prefix: 'card02',
        },
        {
          label: 'メラメラ２',
          prefix: 'card03',
        },
        {
          label: '呆れ',
          prefix: 'card04',
        },
        {
          label: 'ワナワナ',
          prefix: 'card05',
        },
        {
          label: 'スン...',
          prefix: 'card06',
        },
        {
          label: '猛省',
          prefix: 'card07',
        },
      ]
    }
  },
  head() {
    return {
      title: '設定画面',
    }
  },
  async mounted() {
    // 画像一覧を取得してランダム配置
    const res = await this.getInitialImageList()
    this.initialImages = await Promise.all(res.flat().map(async (item: any) => {
      return {
        imageUrl: await item,
        cellNumber: null,
      }
    }))
    this.changeImageRandom();
    await this.getImageListPerCardType(0, this.cardType[0].prefix, null)
    // シェアボタン有効判定
    if (navigator.share === undefined) {
      this.isNavigatorShareButton = false;
    }
  },
  methods: {
    // 一コマ漫画URL一覧取得（初期状態）
    async getInitialImageList() {
      const storageRef = this.$fire.storage.ref()
      const res: any = await storageRef.listAll()
      return await Promise.all(res.prefixes.map(async (folderRef: any) => {
        const childRes: any = await folderRef.list({
          maxResults: 12,
        })
        return await childRes.items.map(async (itemRef: any) => {
          return await itemRef.getDownloadURL()
        })
      }));
    },
    // 一コマ漫画URL一覧取得（カード種別ごと）
    async getImageListPerCardType(index: number, prefix: string, pageToken: string|null) {
      this.isLoadingImageItems = true
      const storageRef = this.$fire.storage.ref()
      const res: any = await storageRef.child(prefix).list({
        maxResults: 12,
        pageToken: pageToken,
      })
      const imageItems = await Promise.all(res.items.map(async (itemRef: any) => {
        return {
          imageUrl: await itemRef.getDownloadURL(),
          cellNumber: null,
        }
      }));
      if (this.images[index]) {
        const imageArray = [...this.images[index], ...imageItems] as ImageData[]
        this.images[index] = Array.from(
          imageArray.reduce((map, currentItem) =>
              map.set(currentItem.imageUrl, currentItem),
            new Map()
          ).values() // 重複を削除
        )
      } else {
        this.images[index] = imageItems
      }
      if (res.nextPageToken) {
        this.nextPageTokenItems[index] = this.nextPageTokenItems[index] ? [...this.nextPageTokenItems[index], res.nextPageToken] : [res.nextPageToken]
      }
      this.setCellNumberToImages(index)
      this.isLoadingImageItems = false
    },
    // images[index]リスト内でcellNumberを設定
    setCellNumberToImages(index: number) {
      if (this.images[index] && !this.newCardCreated) {
        const selectedCells = (this.cells as CellData[]).filter((v: CellData) => {
          return (this.images[index] as ImageData[]).find((item: ImageData) => {
            return v.imageUrl === item.imageUrl
          })
        }) as CellData[]
        (this.images[index] as ImageData[]).forEach((item: ImageData) => {
          selectedCells.forEach((v: CellData) => {
            if (item.imageUrl === v.imageUrl) {
              item.cellNumber = v.cellNumber
            }
          })
        })
      }
    },
    async selectCardType(index: number) {
      this.currentCardTypeIndex = index
      if (!this.images[index] || this.changedCardRandom) {
        await this.getImageListPerCardType(index, this.cardType[index].prefix, null)
        this.changedCardRandom = false
      }
    },
    async more(index: number) {
      await this.getImageListPerCardType(index, this.cardType[index].prefix, this.nextPageTokenItems[index].slice(-1)[0])
    },
    async getNewCard(event: any) {
      this.newCardCreated = true
      await this.getImageListPerCardType(this.currentCardTypeIndex, this.cardType[this.currentCardTypeIndex].prefix, this.nextPageTokenItems[this.currentCardTypeIndex] ? this.nextPageTokenItems[this.currentCardTypeIndex].slice(-1)[0] : null)
      this.newCardCreated = false
    },
    // カード選択ボタン
    changeImage(cell: CellData){
      this.selectCell = cell;
      this.selectImage = undefined;
      this.imageSelectModal = true;
    },
    showImage(cell: CellData){
      this.selectCell = cell;
      this.showImageModal = true;
    },
    set(index: number, image: ImageData) {
      this.confirmModal = true
      this.selectImage = image
      this.selectImageIndex = index
    },
    // 地雷設定ボタン
    toggleBomb(cell: CellData){
      cell.isBomb = !cell.isBomb;
    },
    // モーダルを閉じる
    hide(){
      this.imageSelectModal = false;
    },
    // １コマ漫画ジェネレーターのモーダルを表示
    openMangaGeneratorModal() {
      this.mangaGeneratorModal = true;
      this.$router.push({  path: '/setting/manga-generator', query: { modal: true } })
    },
    // モーダルのカード保存
    async saveImage(){
      if (this.selectCell && this.selectImage) {
        (this.images[this.currentCardTypeIndex][this.selectImageIndex] as ImageData).cellNumber = this.selectCell.cellNumber
        this.selectCell.imageUrl = this.selectImage.imageUrl
      }
      await this.getImageListPerCardType(this.currentCardTypeIndex, this.cardType[this.currentCardTypeIndex].prefix, this.nextPageTokenItems[this.currentCardTypeIndex] ? this.nextPageTokenItems[this.currentCardTypeIndex].slice(-1)[0] : null)
      this.confirmModal = false
    },
    // ランダム配置ボタン
    changeImageRandom(){
      const randomSort = this.initialImages.concat();
      randomSort.sort(()=> Math.random() - 0.5);
      let cellItems: CellData[] = []
      for(let i = 0; i < this.cells.length; i++){
        const image = randomSort[i % randomSort.length];
        if(image){
          cellItems = cellItems.concat({
            imageUrl: image.imageUrl,
            cellNumber: i + 1,
            isBomb: false,
          })
        }
      }
      this.cells = cellItems
      this.setCellNumberToImages(this.currentCardTypeIndex)
      this.changedCardRandom = true
    },
    // 作成ボタン
    make(){
      this.isProcessing = true;
      this.url = undefined;
      this.errorMessage = undefined;
      this.$axios.$post("https://asia-northeast1-mama-ms.cloudfunctions.net/api/ms/", {"panels": this.cells}).then((res:string) => {
        this.url = "https://mama-ms.web.app/games/" + res;
        this.isProcessing = false;
        this.share();
      }).catch((error: any) => {
        this.errorMessage = error.response.data.message;
        this.snackbar = true;
        this.snackbarType = "error";
        this.snackbarMsg = this.errorMessage ?? "システムエラー";
        this.isProcessing = false;
      });
    },
    // シェアするボタン
    async share() {
      if (navigator.share) {
        await navigator.share({
          title: "ママ・マインスイーパー",
          text: "パートナーからゲームが届きました。",
          url: this.url
        });
        this.snackbar = true;
        this.snackbarType = "success";
        this.snackbarMsg = "パートナーにシェアしました。"
      } else {
        await (this as any).$copyText(this.url);
        this.snackbar = true;
        this.snackbarType = "success";
        this.snackbarMsg = "生成したURLをクリップボードにコピーしました。パートナーにシェアしましょう。"
      }
    }
  },
})
</script>

<style scoped lang="scss">

  /* ---------------------------------------------------
    CUSTOMIZE
  ----------------------------------------------------- */
  .themed-grid-col {
    background-color: rgba(86, 61, 124, .15);
    border: 1px solid rgba(86, 61, 124, .2);
    position: relative;
  }

  .themed-grid-col img {
    max-width: 100%;
    max-height: 100%;
  }

  #content {
    margin-bottom: 100px;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .footer-actions {
    background-color: #FFFFFF;
    padding: 15px 0;
    text-align: center;
  }

  .button {
    width: 160px;
    font-size: 19px;
    box-shadow: 3px 4px 7px rgba(0, 0, 0, 0.15), inset 0px -8px 0px rgba(0, 0, 0, 0.21);
  }

  .footer-actions .button:first-of-type {
    margin-right: 30px;
  }

  .footer a {
    color: #FFFFFF;
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

  .card-type-list {
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 15px;
    margin-bottom: 20px;
  }
  .card-type-item {
    margin-right: 18px;
  }
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
    &:nth-child(3n) {
      margin-right: 0;
    }
    background-color: #fff;
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

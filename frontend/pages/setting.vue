<template>
<div class="wrapper">
    <v-dialog
      v-model="imageSelectModal"
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          カードを選んでね
        </v-card-title>
        <v-card-text>
          <v-carousel
            v-model="currentImageIndex"
            height="auto"
             @change="changeTemplate"
          >
            <v-carousel-item
              v-for="(item,i) in images"
              :key="i"
              :src="item"
            ></v-carousel-item>
          </v-carousel>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="secondary" @click.stop="openMangaGeneratorModal">
            新しいカードを作る
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveImage">
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
      <v-card class="manga-generator-modal">
        <v-card-title class="text-h5 grey lighten-2">
          新しいカードを作る
        </v-card-title>
        <v-card-text class="py-4">
          <nuxt-child
            v-if="$route.query.modal === 'true'"
            @getImageUrl="concatImages($event)"
            @closeModal="mangaGeneratorModal = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

        <nuxt-child v-if="$route.query.modal === 'false'" />

        <!-- Page Content  -->
        <div v-if="$route.query.modal == null" id="content">
          <div class="container">
            <div class="row mb-3" >
              <div v-for="(cell, index) in cells" :key="index" class="col-4 pa-0 themed-grid-col">
                <v-icon v-if="cell.isBomb" class="bomb-icon">mdi-bomb</v-icon>
                <img :src="cell.imageUrl" />
                <div class="d-block d-sm-flex justify-space-around text-center">
                  <v-btn class="ma-1" @click.stop="changeImage(cell)">
                    <v-icon>mdi-image</v-icon>
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
  imageUrl: string|undefined,
  isBomb: boolean
}

interface DataType {
  cells: CellData[],
  images: string[],
  imageSelectModal: boolean,
  mangaGeneratorModal: boolean,
  selectImage: undefined|string,
  selectCell: undefined|CellData,
  url: undefined|string,
  errorMessage: undefined|string,
  isProcessing: boolean,
  currentImageIndex: number,
  isNavigatorShareButton: boolean,
  snackbar: boolean,
  snackbarType: string,
  snackbarMsg: string,
}

export default Vue.extend({
  data():DataType {
    const cells = [];
    const CELL_LENGTH = 9;
    for(let i = 0; i < CELL_LENGTH; i++) {
      cells.push({
        imageUrl: undefined,
        isBomb: false
      });
    }

    return {
      cells,
      images: [],
      imageSelectModal: false,
      mangaGeneratorModal: false,
      selectImage: undefined,
      selectCell: undefined,
      url: undefined,
      errorMessage: undefined,
      isProcessing: false,
      currentImageIndex: 0,
      isNavigatorShareButton: false,
      snackbar: false,
      snackbarType: "success",
      snackbarMsg: "",
    }
  },
  head() {
    return {
      title: '設定画面',
    }
  },
  mounted() {
    // 画像一覧を取得してランダム配置
    this.getImageList().then((res:any) => {
      this.images = res;
    }).then(()=>{
      this.changeImageRandom();
    });
    // シェアボタン有効判定
    if (navigator.share === undefined) {
      this.isNavigatorShareButton = false;
    }
  },
  methods: {
    // 一コマ漫画URL一覧取得
    async getImageList() {
      const storageRef = this.$fire.storage.ref()
      const res: any = await storageRef.listAll()
      return await Promise.all(res.items.map(async (itemRef: any) => {
        return await itemRef.getDownloadURL()
      }));
    },
    // カード選択ボタン
    changeImage(cell:CellData){
      this.selectCell = cell;
      this.selectImage = undefined;
      this.imageSelectModal = true;
      this.searchImageIndex()
    },
    // 地雷設定ボタン
    toggleBomb(cell:CellData){
      cell.isBomb = !cell.isBomb;
    },
    // モーダル内のカルーセル選択
    changeTemplate(e:number){
      this.selectImage = this.images[e];
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
    // １コマ漫画生成後に一覧を再取得
    concatImages(event: any) {
      this.getImageList().then((res:any) => {
        this.images = res;
        this.currentImageIndex = this.images.findIndex((v) => {
          return v === event.imageUrl
        })
        this.selectImage = event.imageUrl;
        this.mangaGeneratorModal = false;
      })
    },
    searchImageIndex() {
      this.currentImageIndex = this.images.findIndex((v) => {
        return this.selectCell ? v === this.selectCell.imageUrl : 0
      })
    },
    // モーダルのカード保存
    saveImage(){
      if(this.selectCell && this.selectImage) this.selectCell.imageUrl = this.selectImage;
      this.imageSelectModal = false;
    },
    // ランダム配置ボタン
    changeImageRandom(){
      const randomSort = this.images.concat();
      randomSort.sort(()=> Math.random() - 0.5);
      for(let i = 0; i < this.cells.length; i++){
        const image = randomSort[i % randomSort.length];
        if(image){
          this.cells[i].imageUrl = image;
        }
      }
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

<style scoped>

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

  .message {
    display: none;
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

  .manga-generator-modal {
    background-color: #FFB9D6;
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
    border: none;
  }
</style>

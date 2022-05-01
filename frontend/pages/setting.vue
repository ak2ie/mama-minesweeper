<template>
<div class="wrapper">
    <v-dialog
      v-model="imageSelectModal"
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          画像選択
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
          <v-btn icon @click.stop="openMangaGeneratorModal">
            <v-icon>mdi-image-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="saveImage">
            カード保存
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
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          カード作成
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
              <div v-for="(cell, index) in cells" :key="index" class="col-3 p-0 themed-grid-col">
                <img :src="cell.imageUrl" />
                <div>
                <v-btn @click.stop="changeImage(cell)">
                  <v-icon>mdi-image</v-icon>
                </v-btn>
                <v-btn :color="cell.isBomb ? 'primary' : 'secondary'" @click="toggleBomb(cell)">
                  <v-icon>mdi-bomb</v-icon>
                </v-btn>
                </div>
              </div>
            </div>
          </div>
          <div>
            <v-btn color="primary" @click="changeImageRandom()">
              <span>ランダム配置</span>
            </v-btn>
            <v-btn
              :loading="isProcessing"
              :disabled="isProcessing"
              color="primary" @click="make()">
              <span>作成</span>
            </v-btn>
            <div class="my-3">
              <v-alert v-if="errorMessage" type="error">
                ERROR:<span>{{errorMessage}}</span>
              </v-alert>
              <v-alert v-if="url" type="success">
                URL:<a :href="url">{{url}}</a>
              </v-alert>
            </div>
          </div>
        </div>
        <!-- Page Content  -->
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
}

export default Vue.extend({
  data():DataType {
    const cells = [];
    const CELL_LENGTH = 16;
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
      if(this.selectCell) this.selectCell.imageUrl = this.selectImage;
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
      }).catch((error: any) => {
        this.errorMessage = error.response.data.message;
        this.isProcessing = false;
      });
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
  }

  .themed-grid-col img {
    max-width: 100%;
    max-height: 100%;
  }

  .message {
    display: none;
  }
</style>

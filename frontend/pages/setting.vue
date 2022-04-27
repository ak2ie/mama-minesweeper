<template>
<div class="wrapper">
    <v-dialog v-model="imageSelectModal">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          画像選択
        </v-card-title>
        <v-card-text>
          <v-carousel
            @change="changeTemplate"
          >
            <v-carousel-item
              v-for="(item,i) in images"
              :key="i"
              :src="item.src"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
          </v-carousel>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn icon href="https://single-frame-manga-generator.vercel.app/">
            <v-icon>mdi-image-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="saveImage">
            カード保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

        <!-- Page Content  -->
        <div id="content">
          <div class="container">
            <div class="row mb-3" >
              <div  v-for="(cell, index) in cells" :key="index" class="col-3 p-0 themed-grid-col">
                <img :src="cell.imageUrl" />
                <div>
                <v-btn @click="changeImage(cell)">
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
            <v-btn color="primary" @click="make()">
              <span>作成</span>
            </v-btn>
            <v-alert v-if="errorMEssage" type="error">
              ERROR:<span>{{errorMEssage}}</span>
            </v-alert>
            <v-alert v-if="url" type="success">
              URL:<a :href="url">{{url}}</a>
            </v-alert>
          </div>
        </div>
        <!-- Page Content  -->
    </div> <!-- wrapper -->
</template>

<script lang="ts">
import Vue from 'vue'

interface ImageData {
  src: string,
}

interface CellData {
  imageUrl: string|undefined,
  isBomb: boolean
}

interface DataType {
  cells: CellData[],
  images: ImageData[],
  imageSelectModal: boolean,
  selectImage: undefined|string,
  selectCell: undefined|CellData,
  url: undefined|string,
  errorMEssage: undefined|string,
}

export default Vue.extend({
  async asyncData({ $axios }) {
    // リクエスト（Get）
    const response = await $axios.$get("https://firestore.googleapis.com/v1/projects/single-frame-manga-generator/databases/(default)/documents/images").then(res => {
      const a = [];
      for(const key in res.documents){
        a.push({
          src: 'https://firebasestorage.googleapis.com/v0/b/single-frame-manga-generator.appspot.com/o/'+res.documents[key].fields.fileName.stringValue+'?alt=media&token='+res.documents[key].fields.token.stringValue,
        });
      };
      return a;
    });
    return {
      images: response
    };
  },
  data():DataType {
    const cells = [];
    const CELL_LENGTH = 16;
    for(let i = 0; i < CELL_LENGTH; i++) {
      cells.push({
        imageUrl: "",
        isBomb: false
      });
    }

    return {
      cells,
      images: [],
      imageSelectModal: false,
      selectImage: undefined,
      selectCell: undefined,
      url: undefined,
      errorMEssage: undefined,
    }
  },
  head() {
    return {
      title: '設定画面',
    }
  },
  mounted() {
    this.changeImageRandom();
  },
  methods: {
    // カード選択ボタン
    changeImage(cell:CellData){
      this.selectCell = cell;
      this.imageSelectModal = true;
    },
    // 地雷設定ボタン
    toggleBomb(cell:CellData){
      cell.isBomb = !cell.isBomb;
    },
    // モーダル内のカルーセル選択
    changeTemplate(e:number){
      this.selectImage = this.images[e].src;
    },
    // モーダルを閉じる
    hide(){
      this.imageSelectModal = false;
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
          this.cells[i].imageUrl = image.src;
        }
      }

    },
    // 作成ボタン
    make(){
      this.$axios.$post("https://asia-northeast1-mama-ms.cloudfunctions.net/api/ms/", this.cells).then((res:string) => {
        this.url = "https://mama-ms.web.app/games/" + res;
        this.errorMEssage = undefined;
      }).catch((error: any) => {
        console.log(error);
        this.url = undefined;
        this.errorMEssage = error.message;
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

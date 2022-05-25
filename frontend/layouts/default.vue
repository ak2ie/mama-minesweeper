<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-app-bar v-if="isShowAppBar" :clipped-left="clipped" fixed app flat :class="getStyleClass()">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-btn icon class="prev-btn" @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push('/')"
      >
        <v-img src="/images/header-logo.png" />
      </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
      <!-- <v-btn icon to="/setting">
        <v-icon>mdi-cog</v-icon>
      </v-btn> -->
      <v-btn icon large to="/about">
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main :class="getStyleClass()">
      <v-container fill-height class="justify-center">
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
    <v-footer
      v-if="!isShowAppBar"
      color="secondary lighten-1"
      padless
    >
      <v-row justify="center" no-gutters>
        <v-btn color="white" text class="my-2" to="/about">
          このサイトについて
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '💣 ママ・マインスイーパー',
    }
  },
  computed: {
    /**
     * メニューバーを表示するか
     * @returns {boolean} 表示するならtrue
     */
    isShowAppBar() {
      return this.$route.path !== "/";
    }
  },
  methods: {
    /**
     * ページに応じた背景色を設定するCSSクラス名を取得する
     * @returns {string} CSSクラス名
     */
    getStyleClass() {
      switch (this.$route.name) {
        case "setting":
          return "create-game";
        case "setting-manga-generator":
        case "setting-generator-imageNumber":
          return "create-card";
        case "index":
          return "home";
        case "games-msid":
          return "play";
      }
    }
  }
}
</script>

<style scoped>
/* 戻るボタン */
.prev-btn {
  background-color:#D7FF35;
  filter: drop-shadow(3px 4px 7px rgba(0, 0, 0, 0.15));
}

/* ページに応じた背景色設定用 */
.create-game {
  background-color: #FFE353 !important;
}

.create-card {
  background-color: #FFB9D6 !important;
}

.home {
  background-color: #D7FF35;
}

.play {
  background-color: #83D2FF !important;
}
</style>

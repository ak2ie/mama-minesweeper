import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $checkNGWord(text: string|null): any
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $checkNGWord(text: string|null): any
  }
  interface Context {
    $checkNGWord(text: string|null): any
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject('checkNGWord', (text: string | null) =>
    context.app.$axios.post(
      'https://asia-northeast1-mama-ms.cloudfunctions.net/api/cards',
      { text }
    )
  )
}

export default myPlugin

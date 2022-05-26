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
  inject('checkNGWord', (text: string|null) => context.app.$http.$get(`/services/rest/?method=webpurify.live.check&api_key=${context.$config.PROFANITY_FILTER_API_KEY}&text=${text}&lang=ja&semail=1&sphone=1&slink=1&format=json`))
}

export default myPlugin

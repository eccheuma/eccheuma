import Vue from 'vue'

  import { isMobile } from 'mobile-device-detect'

  Vue.prototype.$isMobile = process.client ? isMobile : false

declare module 'vue/types/vue' {
  interface Vue {
    $isMobile: boolean
  }
}

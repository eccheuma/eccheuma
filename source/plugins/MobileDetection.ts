import Vue from 'vue'

  // import { isMobile } from 'mobile-device-detect'

  Vue.prototype.$isMobile = process.browser 
    ? window.innerHeight > window.innerWidth
    : false

declare module 'vue/types/vue' {
  interface Vue {
    $isMobile: boolean
  }
}

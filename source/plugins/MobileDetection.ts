import Vue from "vue";

// TYPES
import { Context } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $isMobile: boolean
  }
}

export default (ctx: Context) => {

	Vue.prototype.$isMobile = process.browser 
    ? window.innerHeight > window.innerWidth
    : false;

};



import Vue from 'vue'

import animeJS from 'animejs'

Vue.prototype.$AnimeJS = animeJS;

declare module 'vue/types/vue' {
	interface Vue {
		$AnimeJS: typeof animeJS
	}
}

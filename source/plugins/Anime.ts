import Vue from 'vue'

import animeJS from 'animeJS'

Vue.prototype.$AnimeJS = animeJS;

declare module 'vue/types/vue' {
	interface Vue {
		$AnimeJS: typeof animeJS
	}
}
import Vue from 'vue'

import animeJS from 'animejs'

declare module 'animejs' {
	let suspendWhenDocumentHidden: boolean
}

animeJS.suspendWhenDocumentHidden = false;

Vue.prototype.$AnimeJS = animeJS;

declare module 'vue/types/vue' {
	interface Vue {
		$AnimeJS: typeof animeJS
	}
}

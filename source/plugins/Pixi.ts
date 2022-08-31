import Vue from 'vue';

import * as PIXI from 'pixi.js';

Vue.prototype.$PIXI = PIXI;

declare module 'vue/types/vue' {
	interface Vue {
		$PIXI: typeof PIXI
	}
}

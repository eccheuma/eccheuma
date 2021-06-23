import Vue from 'vue'

// Howler 
	import { Howler, Howl } from 'howler'

	Vue.prototype.Howl = Howl;
	Vue.prototype.Howler = Howler;

	Howler.autoUnlock = true;

	declare module 'vue/types/vue' {
		interface Vue {
			Howler: Howler,
			Howl: Howl
		}
	}

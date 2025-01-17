import Vue from 'vue'

// Howler 
	import { Howler, Howl } from 'howler'

	Vue.prototype.Howl 		= Howl;
	Vue.prototype.Howler 	= Howler;

	declare module 'vue/types/vue' {
		interface Vue {
			Howler: Howler,
			Howl: Howl
		}
	}

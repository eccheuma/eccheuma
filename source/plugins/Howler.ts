import Vue from 'vue';

// Howler 
	import { Howler, Howl } from 'howler';

	Vue.prototype.Howl 		= Howl;
	Vue.prototype.Howler 	= Howler;

	// Mute all UI sounds be default. Hard decision, but needed.  
	Howler.mute(true);

	declare module 'vue/types/vue' {
		interface Vue {
			Howler: Howler,
			Howl: Howl
		}
	}

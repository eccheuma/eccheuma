
import Vue from "vue";

// Mixin for sound emit in Howler.js via store
import 			{ mapActions, mapState } 	from "vuex";
import type { Howl, HowlOptions } from "howler";

import type { VuexMap } from "~/contracts/VuexMap";

// TYPES
export type FILE_NAME = "Holl" 
	| "In"
	| "Off" 
	| "On" 
	| "Out"
	| "Tap"
	| "Translate"

export type SOUND_NAME = "Ambient"
	| "Element::Action" 
	| "Element::Disabled"
	| "Element::Hover"
	| "Switch::On"
	| "Switch::Off"
	| "Input::Increment"
	| "Input::Decrement"
	| "Translate::In"
	| "Translate::Out"

export type SoundInstance = {
	file: FILE_NAME,
	name: SOUND_NAME,
	settings?: Partial<HowlOptions>
}

// DECLARE INSTANCE
declare module "vue/types/vue" {
	interface Vue {
		setSounds: (sounds_arr: SoundInstance[]) => void,
		playSound: (howl: Howl | undefined) => Promise<void>
		Sounds: Map<SOUND_NAME, Howl>,
	}
}

// MODULE
export default Vue.extend({
	computed: {

		...mapState({
			Sounds: state => (state as VuexMap).Sound.sounds
		})

	},
	methods: {

		...mapActions({
			registerSound: 	"Sound/registerSound"
		}),

		playSound(howl: Howl) {
			howl.play();
		},

		predefineProperty(sound: SoundInstance): SoundInstance {

			const DEFAULT_SETTINGS: Partial<HowlOptions> = {
				src: `/audio/${ sound.file }.ogg`,
				volume: .5,
				loop: false,
				rate: 1,
			};

			return { 
				file: sound.file,
				name: sound.name, 
				settings: { ...DEFAULT_SETTINGS, ...sound.settings } 
			};

		},

		setSounds(sounds_arr: SoundInstance[]) {

			sounds_arr.forEach((sound) => {
				this.registerSound(this.predefineProperty(sound));
			});

		}

	}
});

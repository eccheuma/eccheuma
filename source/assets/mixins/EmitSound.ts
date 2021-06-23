
import Vue from 'vue';

// Mixin for sound emit in Howler.js via store
import 			{ mapActions, mapState } 	from 'vuex'
import type { Howl, HowlOptions } from 'howler'

import type { VuexModules } from '~/typescript/VuexModules'

// TYPES
export type FILE_NAME = 'Holl' 
	| 'In'
	| 'Off' 
	| 'On' 
	| 'Out'
	| 'Tap'
	| 'Translate'

export type SoundInstance = {
	file: FILE_NAME,
	name: string,
	settings?: Partial<HowlOptions>
}

// DECLARE INSTANCE
declare module 'vue/types/vue' {
	interface Vue {
		setSounds: (sounds_arr: SoundInstance[]) => void,
		playSound: (howl: Howl | undefined) => void
		Sounds: Map<string, Howl>,
	}
}

// MODULE
export default Vue.extend({
	data() {
		return {
			Sounds: new Map() as Map<string, Howl>
		}
	},
	computed: {

		...mapState({
			sounds: state => (state as VuexModules).Sound.sounds
		})

	},
	methods: {

		...mapActions({
			playSound: 			'Sound/playSound',
			registerSound: 	'Sound/registerSound'
		}),

		predefineProperty(sound: SoundInstance): SoundInstance {

			const DEFAULT_SETTINGS: Partial<HowlOptions> = {
				src: `/audio/${ sound.file }.ogg`,
				volume: .75,
				loop: false,
				rate: 1,
			};

			return { 
				file: sound.file,
				name: sound.name, 
				settings: { ...DEFAULT_SETTINGS, ...sound.settings } 
			}

		},

		setSounds(sounds_arr: SoundInstance[]) {

			sounds_arr.forEach((sound) => {
				this.registerSound(this.predefineProperty(sound)).then((howl: Howl) => {

					howl.load();

					this.Sounds.set(sound.name, howl);

				})
			})

		}

	}
})


// Mixin for sound emit in Howler.js via store
import { mapActions } from 'vuex'

// INTERFACES
import type { PROPERTY } from '~/store/Sound'

// TYPES
export type FILE_NAME = 'Holl' 
	| 'In'
	| 'Off' 
	| 'On' 
	| 'Out'
	| 'Tap'
	| 'Translate'

// DECLARE INSTANCE
declare module 'vue/types/vue' {
	interface Vue {
		EmitSound: (_source: FILE_NAME, _setting?: Partial<PROPERTY>) => void
	}
}

// MODULE
export default {
	methods: {
		...mapActions({
			ActivateSound: 'Sound/ActivateSound'
		}),
		EmitSound(_source: FILE_NAME, _setting?: PROPERTY ) {

			const default_setting = {
				status: true,
				volume: .75,
				loop: false,
				rate: 1,
			};

			this.ActivateSound({ 
				_path: _source, 
				_prop: { ...default_setting, ..._setting }
			})

		},
	}
}

// Mixin for sound emit in Howler.js via store
import { mapActions } from 'vuex'

// TYPES
export type T_SOURCE = string

// INTERFACES
import { PROPERTY } from '~/store/Sound.ts'

// DECLARE INSTANCE
declare module 'vue/types/vue' {
	interface Vue {
	  EmitSound: (_source: T_SOURCE, _setting?: Partial<PROPERTY>) => void
	}
}

// MODULE
export default {
	methods: {
		...mapActions({
			ActivateSound: 'Sound/ActivateSound'
		}),
		EmitSound(_source: T_SOURCE, _setting?: PROPERTY ) {

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
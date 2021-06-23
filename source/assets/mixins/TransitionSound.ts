
// Mixin for a sound transition binded on a mounted and beforeDestroy life cycle.

import Vue from 'vue'

import EmitSound from '~/assets/mixins/EmitSound'

export default Vue.extend({
	mixins: [ EmitSound ],
	created() {
		this.setSounds([
			{
				file: 'In',
				name: 'TransitionSoundIn',
				settings: { rate: .75, volume: .25 }
			},
			{
				file: 'Out',
				name: 'TransitionSoundOut',
				settings: { rate: .33, volume: .25 }
			}
		])
	},
	mounted() {

		// setTimeout(() => this.playSound(this.Sounds.get('TransitionSoundIn')), 500);

	},
	destroyed() {

		setTimeout(() => this.playSound(this.Sounds.get('TransitionSoundOut')), 250);

	},
})

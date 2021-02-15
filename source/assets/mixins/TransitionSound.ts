
// Mixin for a sound transition binded on a mounted and beforeDestroy life cycle.

import Vue from 'vue'

import EmitSound from '~/assets/mixins/EmitSound.ts'

export default Vue.extend({
	mixins: [ EmitSound ],
	mounted() {

		setTimeout(() => {
			this.EmitSound('Translate', { volume: .35, loop: false, })
		}, 750);

	},
	destroyed() {

		setTimeout(() => {
			this.EmitSound('Out', { volume: .35, loop: false, })
		}, 250);

	},
})
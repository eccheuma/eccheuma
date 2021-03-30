
// Mixin for a sound transition binded on a mounted and beforeDestroy life cycle.

import Vue from 'vue'

import EmitSound from '~/assets/mixins/EmitSound'

export default Vue.extend({
	mixins: [ EmitSound ],
	mounted() {

		// setTimeout(() => {
		// 	this.EmitSound('In', { rate: .5, volume: .25 })
		// }, 500);

	},
	destroyed() {

		setTimeout(() => {
			this.EmitSound('Out', { rate: .6, volume: .25 })
		}, 250);

	},
})

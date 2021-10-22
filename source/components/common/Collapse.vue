<template>
	<div class="eccheuma-collapse" :class="{ 'utils::dead-GPU': BROWSER && !$PIXI.utils.isWebGLSupported() }">
		<slot />
	</div>
</template>

<style lang="scss">

.eccheuma-collapse {
	overflow-y: hidden;
	will-change: height;
	height: 0px;
	transition: {
		property: height;
		timing-function: ease-in-out;
	};
}

</style>

<script lang="ts">

import Vue, { PropOptions } from 'vue'

export default Vue.extend({
	props: {
		active: {
			type: Boolean,
			required: true,
		},
		options: {
			type: Object,
			required: false,
			default() {
				return {
					duration: 750,
					emit: false,
					contentWatcher: false,
				}
			}
		} as PropOptions<{ duration: number, emit: boolean, contentWatcher: boolean }>
	},
	watch: {
		active: {
			handler(val) {
				this.$nextTick(() => this.collapse(val))
			}
		},
	},
	updated() {

		if ( this.options.contentWatcher ) {
			this.$nextTick(() => {
				this.collapse(this.active);
			})
		}

	},
	methods: {
		collapse(val: boolean) {

			const el = (this.$el as HTMLElement);

			requestAnimationFrame(() => {
				el.style.setProperty('transition-duration', `${ this.options.duration }ms`)
				el.style.setProperty('height', `${ val ? (el.firstChild as HTMLElement).offsetHeight : 0 }px`)
			})

			setTimeout(() => {

				el.style.removeProperty('transition-duration'); 

				if (this.options.emit) {
					this.$emit('collapsed', this.active)
				}

			}, this.options.duration)

		}
	}
})

</script>

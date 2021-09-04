<template>
	<div class="eccheuma-collapse" :style="styleObject" :class="{ 'utils::dead-GPU': BROWSER && !$PIXI.utils.isWebGLSupported() }">
		<slot />
	</div>
</template>

<style lang="scss">

.eccheuma-collapse {
	overflow-y: hidden;
	will-change: height;
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
				}
			}
		} as PropOptions<{ duration: number }>
	},
	data() {
		return {

			Collapse: false,

			InChange: false,
			InnerHeight: 0,

		}
	},
	computed: {
		styleObject(): Partial<CSSStyleDeclaration> {

			return {
				height: 						this.Collapse ? `${ this.InnerHeight }px` 			: '0px',
				transitionDuration: this.InChange ? `${ this.options.duration }ms` 	: 'unset',
			}

		}
	},
	watch: {
		active: {
			handler() {

				this.$nextTick(this.ToggleCollapse)

			},
		},
	},
	async mounted() {

		this.Collapse = this.active; 
		
		this.InnerHeight = await this.GetInnerHeight();

	},
	updated() {

		if ( this.active && !this.InChange ) {
			this.$nextTick().then(async () => {
				this.InnerHeight = await this.GetInnerHeight()
			})
		}

	},
	methods: {
		ToggleCollapse() {

			this.$nextTick().then(() => {

				this.InChange = true; setTimeout(() => { this.InChange = false; this.Collapsed() }, this.options.duration )
				this.Collapse = this.active;
				
			})

		},
		GetInnerHeight(): Promise<number> {

			const CONTAINER_NODE = this.$slots.default![0].elm! as Element;

			return new Promise((resolve) => {
				resolve(CONTAINER_NODE.getBoundingClientRect().height)
			})
			
		},
		Collapsed() {
			this.$emit('collapsed', this.active)
		}
	},
})

</script>

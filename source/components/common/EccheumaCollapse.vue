<template>
	<div class="eccheuma_collapse-container" ref="collapse" :style="styleObject">
		<div class="test" ref="test"></div>
		<div class="eccheuma_collapse-wrap" ref="wrap">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.eccheuma_collapse {
	&-container {
		overflow-y: hidden;
		will-change: height;
		transition: {
			property: height;
			timing-function: ease-in-out;
		};
	}
	&-wrap {
		position: relative;
	}
}

</style>

<script lang="ts">

import Vue, { PropOptions } from 'vue'

export default Vue.extend({
	props: {
		active: {
			required: true,
			default: false,
		},
		options: {
			default() {
				return {
					duration: 500,
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
	updated() {

		if( this.active && !this.InChange ) {
			this.$nextTick().then(async () => {
				this.InnerHeight = await this.GetInnerHeight()
			})
		}

	},
	computed: {
		styleObject(): any {
			return {
				'height': this.Collapse ? `${ this.InnerHeight }px` : '0px',
				'transition-duration': this.InChange ? `${ this.options.duration }ms` : '',
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
	methods: {
		async ToggleCollapse() {

			this.InnerHeight = await this.GetInnerHeight();

			this.$nextTick().then(() => {

				this.InChange = true; setTimeout(() => { this.InChange = false; this.Collapsed() }, this.options.duration )
				this.Collapse = this.active;
				
			})

		},
		GetInnerHeight(): Promise<number> {

			const CONTAINER_NODE = this.$refs.wrap as HTMLElement;

			return new Promise(resolve => {

				console.log("PROMISE")

				resolve(CONTAINER_NODE.getBoundingClientRect().height)

			})
			
		},
		Collapsed() {
			this.$emit('collapsed', this.active)
		}
	},
	mounted() {

		this.Collapse = this.active;

		// const EL 		= this.$refs.test as HTMLElement
		// const VNODE 	= this.$slots.default?.[0].elm
		// 
		// VNODE ? EL.append(VNODE.cloneNode()) : null

	}
})

</script>
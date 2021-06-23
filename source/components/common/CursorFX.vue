<template>
	<div ref="CurWrap" class="CursorFX-Wrap">
		<span v-show="CursorShowed" ref="CurRef" class="CursorFX" />
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	// MODULE
	export default Vue.extend({
		data() {
			return {

				CursorShowed: false,

				CursorNode: null as unknown as HTMLElement | null,
				ParentNode: null as unknown as HTMLElement | null,

			}
		},
		computed: {
			CursorNodeRect(): { H: number, W: number } {

				if ( this.CursorNode ) {
					return {
						H: this.CursorNode.getBoundingClientRect().height / 2,
						W: this.CursorNode.getBoundingClientRect().width 	/ 2,
					}
				} 

				return { H: 0, W: 0 }

			}
		},
		watch: {
			ParentNode: {
				handler() {

					this.ParentNode?.addEventListener('mouseenter', 	this.defineListenersAction)
					this.ParentNode?.addEventListener('mouseleave', 	this.defineListenersAction)
					this.ParentNode?.addEventListener('click', 				this.defineListenersAction)

				}
			}
		},
		mounted() {

			this.ParentNode = this.$el.parentElement!
			this.CursorNode = this.$refs.CurRef as HTMLElement 
				
		},
		destroyed() {

			this.ParentNode?.removeEventListener('mouseenter', 	this.defineListenersAction)
			this.ParentNode?.removeEventListener('mouseleave', 	this.defineListenersAction)
			this.ParentNode?.removeEventListener('click', 			this.defineListenersAction)

		},	
		methods: {
			setCursorPosition(event: MouseEvent) {

				requestAnimationFrame( () => {
					if ( this.CursorNode && this.ParentNode ) {
						this.CursorNode.style.top 	= `${ event.y - this.ParentNode.getBoundingClientRect().y }px`;
						this.CursorNode.style.left 	= `${ event.x - this.ParentNode.getBoundingClientRect().x }px`;
					}
				})

			},
			animateCursor( config = {} ) {

				this.$AnimeJS.remove( this.CursorNode )

				const Default = {
					targets: this.CursorNode,
					opacity: [0, 0.1],
					scale: [0, 10],
					easing: 'easeInOutQuad',
					duration: 1000,
				}

				this.$AnimeJS({ ...Default, ...config })

			},
			defineListenersAction(event: MouseEvent) {

				this.CursorShowed = true

				const EventProperty = { capture: true }

				switch (event.type) {

					case 'mouseenter':

						this.animateCursor({
							begin: () => {
								window.addEventListener('mousemove', this.setCursorPosition, EventProperty);
							}
						}); break;

					case 'mouseleave':

						this.animateCursor({
							direction: 'reverse',
							complete: () => { 
								
								this.CursorShowed = false;

								window.removeEventListener('mousemove', this.setCursorPosition, EventProperty ); 

							},
						}); break;

					case 'click':

						this.setCursorPosition(event)

						this.animateCursor({
							opacity: [this.CursorNode?.style.opacity ?? 1, .5],
							scale: [10, 5],
							duration: 250,
							direction: 'alternate',
						}); break;

				}

			},
		},
	})

</script>

<style lang="sass" scoped>

.CursorFX
	pointer-events: none
	position: absolute
	top: 0px
	left: 0px
	height: 10px
	width: 10px
	background-color: rgb(var(--color-def-6))
	z-index: 9999
	border-radius: 100%
	filter: blur(3px)
	mix-blend-mode: hard-light
	&-Wrap
		overflow: hidden
		position: absolute
		top: 0
		left: 0
		width: 100%
		height: 100%
		-webkit-mask-image: radial-gradient(circle, black 50%, transparent 100%)

</style>

<template>
	<div class="CursorFX-Wrap" ref="CurWrap">
		<span class="CursorFX" v-show="CursorFX_state" ref="CurRef"></span>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'
	// VUEX
	import { mapActions, mapState} from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	// MODULE
	export default Vue.extend({
		data() {
			return {

				CursorFX_state: false,

				CursorNode: null as unknown as HTMLElement | null,
				ParentNode: null as unknown as HTMLElement | null,

				ParentNodeRect: {} as DOMRect | undefined

			}
		},
		watch: {
			ParentNode: {
				handler() {
					if ( this.ParentNode ) {

						this.ParentNode.addEventListener("mouseenter", 	this.ListenersAction )
						this.ParentNode.addEventListener("mouseleave", 	this.ListenersAction )
						this.ParentNode.addEventListener("click", 			this.ListenersAction )

						this.ParentNodeRect = this.ParentNode.getBoundingClientRect()

					}
				}
			}
		},
		computed: {
			CursorNodeRect(): { H: number, W: number } {

				return {
					H: this.CursorNode ? this.CursorNode.getBoundingClientRect().height / 2 : 0,
					W: this.CursorNode ? this.CursorNode.getBoundingClientRect().width 	/ 2 : 0,
				}

			}
		},
		methods: {
			SetCursorPosition(event: MouseEvent) {

				window.requestAnimationFrame( () => {
					if ( this.CursorNode && this.ParentNodeRect ) {

						this.CursorNode.style.top 	= `${(event.y - this.ParentNodeRect.top) 	- this.CursorNodeRect.H }px`
						this.CursorNode.style.left 	= `${(event.x - this.ParentNodeRect.left) - this.CursorNodeRect.W }px`

					}
				})

			},
			AnimateCursor( config = {} ) {

				this.$AnimeJS.remove( this.CursorNode )

				const Default = {
					targets: this.CursorNode,
					opacity: [0, 0.1],
					scale: [0, 10],
					easing: "easeInOutQuad",
					duration: 1000,
				}

				this.$AnimeJS({...Default, ...config})

			},
			ListenersAction(event: MouseEvent) {

				this.CursorFX_state = true

				const EventProperty = { capture: true }

				switch (event.type) {

					case `mouseenter`:

						this.AnimateCursor({
							begin: () => {
								window.addEventListener("mousemove", this.SetCursorPosition, EventProperty);
							}
						}); break;

					case `mouseleave`:

						this.AnimateCursor({
							direction: "reverse",
							complete: () => { 
								
								this.CursorFX_state = false;

								window.removeEventListener("mousemove", this.SetCursorPosition, EventProperty ); 

							},
						}); break;

					case `click`:

						this.SetCursorPosition(event)

						this.AnimateCursor({
							opacity: [this.CursorNode?.style.opacity ?? 1, .5],
							scale: [10, 5],
							duration: 250,
							direction: "alternate",
						}); break;

				}

			},
		},
		mounted() {

			this.ParentNode = ( this.$refs.CurWrap 	as HTMLElement ).parentElement
			this.CursorNode = ( this.$refs.CurRef 	as HTMLElement )
				
		},
		destroyed() {

			if ( this.ParentNode ) {
				this.ParentNode.addEventListener("mouseenter", 	this.ListenersAction )
				this.ParentNode.addEventListener("mouseleave", 	this.ListenersAction )
				this.ParentNode.addEventListener("click", 			this.ListenersAction )
			}

		}	
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
	background-color: $color5
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
		-webkit-mask-image: radial-gradient(circle, rgba($color1, 1) 55%, rgba($color1, 0) 100%)

</style>
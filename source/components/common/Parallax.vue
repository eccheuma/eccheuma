<template>
	<div class="Parallax-Wrapper" ref="Wrapper" :data-test="inViewport">

		<div class="Parallax-Container" ref="Container">
			<slot></slot>
		</div>

	</div>
</template>

<style lang="sass" scoped>

.Parallax
	&-Container
		height: 100%
		width: 100%
	&-Wrapper
		overflow: hidden
		height: 100%
		width: 100%

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	import type { CCSTypedObjectModel } from '~/types/CSSTypedOM.ts'

	interface Options {
		Multiplier: number
		Direction: 'down' | 'up'
		OpacityFade: boolean
		OpacityFadeOffset: number
	}

	export default Vue.extend({
		props: {
			options: {
				type: Object,
				required: true,
				default() {
					return {
						Multiplier: .25,
						Direction: 'down',
						OpacityFade: true,
						OpacityFadeOffset: 100,
					}
				}
			} as PropOptions<Options>,
		},
		data() {
			return {

				inViewport: false,

				Init: false,

				ElementPosition: {} as { Top: number, Bottom: number },
				ScrollPosition: 0,

				DefaultOptions: {
					Multiplier: .25,
					Direction: 'down',
					OpacityFade: false,
					OpacityFadeOffset: 0,
				} as Options

			}
		},
		computed: {
			TranslateValue(): number {

				const MULTIPLIER 	= this.options.Multiplier || this.DefaultOptions.Multiplier
				const DIR 				= this.options.Direction 	|| this.DefaultOptions.Direction

				switch ( DIR.toLowerCase() ) {
					case 'down': return 0 + Math.trunc( this.ScrollPosition * MULTIPLIER ); break;
					case 'up': return 0 - Math.trunc( this.ScrollPosition * MULTIPLIER ); break;
					default: return 0
				}

			},
			OpacityValue(): number {

				const FADE = this.options.OpacityFade || this.DefaultOptions.OpacityFade

				if ( FADE && this.Init ) {

					const ELEMENT = this.ElementPosition
					const OFFSET 	= this.options.OpacityFadeOffset || this.DefaultOptions.OpacityFadeOffset
					const RANGE 	= Math.abs( ( this.ScrollPosition + OFFSET ) - ELEMENT.Bottom )

					// Нижняя граница для конечного затухания. ENG: Endpoint of scrollPosition where opacity should gonna reach 0 

					if ( this.ScrollPosition <= ELEMENT.Bottom - OFFSET ) {

						const RES = RANGE / ( ELEMENT.Bottom - OFFSET); return +RES.toFixed(2)

					} return 0	

				} return 0
			}
		},
		watch: {
			inViewport: {
				handler() {
					if ( this.inViewport ) {
						window.addEventListener('scroll', this.ScrollHandler);
					} else {
						window.removeEventListener('scroll', this.ScrollHandler);
					}
				},
			},
			TranslateValue: {
				handler() { 
					this.StyleElement(
						'Container', 
						`transform: translateY(${ this.TranslateValue as number }px)`, 
						'px'
					) 
				}
			},
			OpacityValue: {
				handler() { 
					this.StyleElement(
						'Wrapper', 
						`opacity: ${ this.OpacityValue }`, 
						'number' 
					)
				}
			}
		},
		mounted() {
			this.InitElement()
		},
		methods: {
			InitElement(): void {

				const ELEMENT = this.$refs.Wrapper as Element

				this.$nextTick(() => {
					this.ElementPosition = {
						Top: ELEMENT.getBoundingClientRect().top + pageYOffset, 
						Bottom: ELEMENT.getBoundingClientRect().bottom + pageYOffset,
					}
				})

				new IntersectionObserver((entry) => {
					this.inViewport = entry.pop()?.isIntersecting || false 
				}).observe(this.$el)
				
				window.addEventListener('scroll', this.ScrollHandler);

				this.Init = true

			},
			ElementInView(): boolean {

				const ELEMENT = this.ElementPosition

				const VIEW = {
					Top: this.ScrollPosition,
					Bottom: this.ScrollPosition + window.innerHeight,
				}

				return VIEW.Top <= ELEMENT.Bottom || ELEMENT.Bottom >= VIEW.Top
				
			},
			ScrollHandler(): void {

				if ( this.inViewport && this.ScrollPosition !== Math.trunc( window.scrollY )) {
					requestAnimationFrame( () => {
						this.ScrollPosition = Math.trunc( window.scrollY );
					})
				}

			},
			StyleElement(_REF: string, _CSS: string, _TYPE: 'px' | 'number' ) {

				if ( this.ElementInView() ) { 
					
					const ELEMENT = this.$refs[_REF] as Element
					
					requestAnimationFrame( () => { 
						ELEMENT.setAttribute('style', _CSS ) 
					})

				}
				
			}
		},
	})
	
</script>

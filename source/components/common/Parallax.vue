<template>
	<div ref="Wrapper" class="Parallax-Wrapper" :data-test="inViewport">

		<div ref="Container" class="Parallax-Container">
			<slot />
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

	interface Options {
		Multiplier: number
		Direction: 'down' | 'up'
		OpacityFade: boolean
		OpacityFadeOffset: number
	}

	type POSITION = { Top: number, Bottom: number }

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
			forcedScrollPosition: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {

				inViewport: false,

				Init: false,

				ElementPosition: { Top: 0, Bottom: 0 } as POSITION,
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
					case 'down': 	
						return 0 + Math.trunc( this.ScrollPosition * MULTIPLIER );
					case 'up': 		
						return 0 - Math.trunc( this.ScrollPosition * MULTIPLIER ); 
					default: 			
						return 0
				}

			},
			OpacityValue(): number {

				const H = this.ElementPosition.Top + this.ElementPosition.Bottom;

				return ( H - this.ScrollPosition ) / ( H / 100 );

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

					const css = `transform: translateY(${ this.TranslateValue as number }px)`;

					this.StyleElement('Container', css); 

				}
			},
			OpacityValue: {
				handler() { 
					this.StyleElement(
						'Wrapper', 
						`opacity: ${ this.OpacityValue }%`, 
					)
				}
			},
			ScrollPosition: {
				handler() {
					if (this.inViewport) {
						this.$emit('scroll-position', this.ScrollPosition);
					}
				}
			},
			forcedScrollPosition: {
				handler() {
					if (!this.inViewport) {
						this.ScrollPosition = this.forcedScrollPosition;
					}
				}
			}
		},
		mounted() {

			this.InitElement();

		},
		methods: {

			async InitElement() {

				this.ElementPosition = await this.getElementPosition(this.$el);

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

			StyleElement(_REF: string, _CSS: string ) {

				if ( this.ElementInView() ) { 
					
					const ELEMENT = this.$refs[_REF] as Element
					
					requestAnimationFrame( () => { 
						ELEMENT.setAttribute('style', _CSS ) 
					})

				}
				
			},

			getElementPosition(el: Element): Promise<POSITION> {
				return new Promise((resolve) => {

					const VALUES: POSITION = {
						Top: 		el.getBoundingClientRect().top 		+ pageYOffset, 
						Bottom: el.getBoundingClientRect().bottom + pageYOffset,
					}

					resolve(VALUES)

				})
			}

		},
	})
	
</script>

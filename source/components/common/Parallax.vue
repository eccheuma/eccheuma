<template>
	<div ref="Wrapper" class="parallax-wrapper" :data-test="inViewport">
		<div ref="Container" class="parallax-container">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>

.parallax {
	&-container {
		height: 100%;
		width: 100%;
	}
	&-wrapper {
		overflow: hidden;
		height: 100%;
		width: 100%;
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from "vue";

	interface Options {
		Multiplier: number
		Direction: "down" | "up"
		OpacityFade: boolean
		OpacityFadeOffset: number
	}

	type POSITION = { Top: number, Bottom: number }

	// type requestIdleCallback = (cb: () => unknown) => unknown

	export default Vue.extend({
		props: {
			options: {
				type: Object,
				required: true,
				default() {
					return {
						Multiplier: .25,
						Direction: "down",
						OpacityFade: true,
						OpacityFadeOffset: 100,
					};
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

				ElementPosition: { Top: 0, Bottom: 0 } as POSITION,
				ScrollPosition: 0,

				DefaultOptions: {
					Multiplier: .25,
					Direction: "down",
					OpacityFade: false,
					OpacityFadeOffset: 0,
				} as Options

			};
		},
		computed: {
			translateValue(): number {

				const MULTIPLIER 	= this.options.Multiplier || this.DefaultOptions.Multiplier;
				const DIR 				= this.options.Direction 	|| this.DefaultOptions.Direction;

				switch ( DIR.toLowerCase() ) {
					case "down": 	
						return 0 + Math.trunc( this.ScrollPosition * MULTIPLIER );
					case "up": 		
						return 0 - Math.trunc( this.ScrollPosition * MULTIPLIER ); 
					default: 			
						return 0;
				}

			},
			opacityValue(): number {

				const H = this.ElementPosition.Top + this.ElementPosition.Bottom;

				return ( H - this.ScrollPosition ) / ( H / 100 );

			}
		},
		watch: {
			inViewport: {
				handler() {
					if ( this.inViewport ) {
						window.addEventListener("scroll", this.scrollHandler);
					} else {
						window.removeEventListener("scroll", this.scrollHandler);
					}
				},
			},
			translateValue: {
				handler() { 

					const css = `transform: translateY(${ this.translateValue as number }px)`;

					this.setStyleElement("Container", css); 

				}
			},
			opacityValue: {
				handler() { 
					this.setStyleElement(
						"Wrapper", 
						`opacity: ${ this.opacityValue }%`
					);
				}
			},
			ScrollPosition: {
				handler() {
					requestIdleCallback(() => {
						this.$emit("scroll-position", this.ScrollPosition);
					});
				}
			},
			forcedScrollPosition: {
				handler() {
					requestIdleCallback(() => {
						this.ScrollPosition = this.forcedScrollPosition;
					});
				}
			}
		},
		mounted() {
			this.initElement();
		},
		methods: {

			async initElement() {

				this.ElementPosition = await this.getElementPosition(this.$el as HTMLElement);

				new IntersectionObserver((entry) => {
					this.inViewport = entry.pop()?.isIntersecting || false; 
				}).observe(this.$el);
				
				window.addEventListener("scroll", this.scrollHandler);

			},

			scrollHandler(): void {
				requestAnimationFrame(() => {
					this.ScrollPosition = window.scrollY;
				});
			},

			setStyleElement(id: string, css: string ) {
				(this.$refs[id] as Element).setAttribute("style", css ); 
			},

			getElementPosition(el: HTMLElement): Promise<POSITION> {
				return new Promise((resolve) => {

					const VALUES: POSITION = {
						Top: 		el.getBoundingClientRect().top 		+ scrollY, 
						Bottom: el.getBoundingClientRect().bottom + scrollY,
					};
					
					resolve(VALUES);

				});
			}

		},
	});
	
</script>

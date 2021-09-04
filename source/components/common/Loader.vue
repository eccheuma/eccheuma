<template>
	
	<transition name="LoaderTransition">
		<section v-if="active && ignite" class="page_loader-container">

			<svg ref="svg" fill="none" viewBox="0 0 157 24">
				<path
					ref="path"
					d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
					stroke="none"
				/>
			</svg>
			<span ref="stage">{{ stages[curentStage].Message }}</span>

		</section>
	</transition>

</template>

<style lang="scss" scoped>

.LoaderTransition {
	&-enter {
		opacity: 0;
		&-active {
			transition: opacity 500ms ease-in-out;
		}
		&-to {
			opacity: 1
		}
	}
	&-leave {
		opacity: 1;
		&-active {
			transition: opacity 500ms ease-in-out;
		}
		&-to {
			opacity: 0
		}
	}
}

.page_loader {

	&-container {

		position: fixed; 
		top: 0; 
		left: 0;
		right: 0; 
		bottom: 0;
		z-index: 9999;

		height: 100%;
		width: 100%;

		display: grid;
		grid-template: {
			rows: 50% 1fr 1fr;
			columns: 100%;
		};

		background: radial-gradient(circle, rgb(var(--color-mono-200), .85) 0%, rgb(var(--color-mono-200), 1) 50%);
		backdrop-filter: blur(3px);

		&:after {
			content: '';

			position: absolute;
			width: calc(100% - 2vw);
			height: calc(100% - 2vh);

			left: 1vw;
			top: 1vh;

			border: 1px solid var(--color-accent-edges-100);
			z-index: -1;

		}

		svg {

			width: 10vw;
			align-self: end;
			justify-self: center;

		}

		span {

			opacity: 0;

			align-self: start;
			justify-self: center;
			padding: 3vh;

			color: rgba(var(--mono-700));
			font: {
				family: var(--decor-font);
				size: var(--font-size-24);
			}

			letter-spacing: .25ch;

		}

		// p {

		// 	align-self: center;
		// 	justify-self: center;

		// 	text-align: center;
		// 	width: 65ch;

		// 	color: rgba(var(--mono-400));
		// 	font: {
		// 		size: var(--font-size-14);
		// 	}

		// }

	}

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// TYPES
	import type { AnimeParams } from 'animejs'

	export type LoadStage = { LoadPoint: number, Message: string }

	// MODULE
	export default Vue.extend({
		props: {
			stages: {
				type: Array,
				default() {
					return [
						{ LoadPoint: 0, Message: 'Подготовка' },
					]
				}
			} as PropOptions<LoadStage[]>,
			controllable: {
				type: Boolean,
				default: false,
			},
			ignite: {
				type: Boolean,
				default: false,
			},
			forcedStage: {
				type: Number,
				default: 0,
			} as PropOptions<number>
		},
		data() {
			return {

				active: true,
				curentStage: 0,

			} 
		},
		mounted() {

			if ( this.ignite ) {
				this.changeStage(1)
			}

		},		
		methods: {

			changeStage(stage: number) {

				const StageDur = Math.trunc(750 - (500 * Math.random()));

				this.animateText({ direction: 'normal' }).then(() => {
					
					const animations = [
						this.animateText({ direction: 'reverse', endDelay: StageDur }),
						this.animateLogo({ direction: 'normal',  duration: StageDur }),
					]
	
					Promise.all(animations).then(() => {

						const newStage = stage + 1;

						if ( this.stages[newStage] ) { 

							this.curentStage = newStage;
							this.changeStage(newStage);

						} else {

							this.$AnimeJS({
								targets: this.$refs.svg,
								fill: { value: 'rgb(255,255,255)' },
								duration: 1000,
								endDelay: 1000,
								easing: 'linear',
								complete: () => {
									this.active = false; 
								}
							})

						}

					})
					
				})

			},

			animateText(params?: AnimeParams): Promise<boolean> {

				return new Promise((resolve) => {

					this.$AnimeJS({
						targets: this.$refs.stage,	
						easing: 'easeInOutQuad',
						duration: 500,
						round: 100, 
						opacity: [0, 1],
						
						...params,

						complete() {
							resolve(true)
						}
						
					})

				})

			},

			animateLogo(params?: AnimeParams): Promise<boolean> {

				const DASH			= this.$AnimeJS.setDashoffset(this.$refs.path as SVGElement);
				
				const Q					= this.stages.length - 1
				const N					= this.curentStage < Q ? this.curentStage + 1 : Q

				const defineOffset 		= (tar: number) => (DASH / Q) * (Q - (tar / 2));

				return new Promise((resolve) => {

					this.$AnimeJS({
						targets: this.$refs.path,	
						easing: 'easeInOutQuad',
						round: 1,
						strokeDashoffset: [defineOffset(this.curentStage), defineOffset(N)],
						stroke: 'rgb(255,255,255)',
						
						...params,

						complete() {
							resolve(true)
						}
						
					})

				})

			},

		}
	})

</script>

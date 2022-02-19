<template>
	
	<transition name="LoaderTransition">
		<section v-show="active" class="page_loader-container">

			<svg ref="svg" fill="none" viewBox="0 0 157 24">
				<path
					ref="path"
					d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
					stroke="none"
				/>
			</svg>

			<template v-if="stages[curentStage]">
				<span ref="stage">{{ stages[curentStage].Message }}</span>
			</template>

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

		transform: translateZ(0);

		height: 100%;
		width: 100%;

		display: grid;
		grid-template: {
			rows: 50% 1fr 1fr;
			columns: 100%;
		};

		background: radial-gradient(farthest-side, rgb(var(--color-mono-200), .9) 0%, rgb(var(--color-mono-200), 1) 85%);
		backdrop-filter: blur(12px);

		&:after {
			content: '';

			position: absolute;
			width: calc(100% - 2vw);
			height: calc(100% - 4vh);

			left: 1vw;
			top: 2vh;

			border: 1px solid var(--color-accent-edges-100);
			z-index: -1;

		}

		svg {

			width: max(10vw, 140px);
			align-self: end;
			justify-self: center;

			path {
				color: red;
			}

		}

		span {

			opacity: 0;

			align-self: start;
			justify-self: center;
			padding: 3vh;

			color: rgba(var(--mono-800));
			font: {
				family: var(--decor-font);
				size: var(--font-size-24);
			}

			letter-spacing: .15ch;

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

	// VARIABLES
	const ICON_COLOR_VARIABLE = 'rgb(var(--color-mono-900))'

	// MODULE
	export default Vue.extend({
		props: {
			stages: {
				type: Array,
				default() {
					return [
						{ LoadPoint: 0, 	Message: 'Подготовка' },
						{ LoadPoint: 100, Message: 'Готово' },
					]
				}
			} as PropOptions<Array<LoadStage>>,
			controllable: {
				type: Boolean,
				default: false,
			},
			ignite: {
				type: Boolean,
				default: false,
			} as PropOptions<boolean>,
			error: {
				type: Boolean,
				default: false
			},
			forcedStage: {
				type: Number,
				default: 0,
			},
			timeLimit: {
				type: Number,
				default: 10000
			},
		},
		data() {
			return {

				idle: true,

				active: this.ignite,
				curentStage: 0,

				dash: 1 as number,

			} 
		},
		computed: {

			nextStage(): number {
				return this.curentStage < this.stages.length 
					? this.curentStage + 1 
					: this.stages.length;
			},

			segmentLength(): number {
				return this.dash / this.stages.length
			},

			segmentCoord(): [number, number] {

				return [
					this.segmentLength * ( this.stages.length - ( this.curentStage / 2 )),
					this.segmentLength * ( this.stages.length - ( this.nextStage / 2 ))
				]

			}

		},
		watch: {
			forcedStage: {
				handler(stage: number) {

					if ( this.active === false ) this.active = true;

					// After each force stage change, add func in microtask queue 
					// to not interrupt already running loader stage
					queueMicrotask(() => this.changeStage(stage))

				}
			},
			active: {
				handler() {
					setTimeout(() => { this.active = false }, this.timeLimit );
				}
			}
		},
		mounted() {

			if ( this.ignite ) {
				this.$nextTick(() => {
					this.changeStage(0);
				})
			}

			this.$nextTick(() => {
				if ( this.$refs.path ) {
					this.dash = this.$AnimeJS.setDashoffset(this.$refs.path as SVGElement);
				}
			})

		},
		methods: {

			async changeStage(stage: number) {

				this.idle = false;

				const stageDurationFN = () => Math.trunc(750 - (250 * Math.random()));
				
				// ---

				console.log('await block start')

				await this.animateText({ direction: 'normal',  duration: 250 });
				await this.pathlineDash({ direction: 'normal', duration: stageDurationFN() });
				await this.animateText({ direction: 'reverse', duration: 250 });

				console.log('await block end')

				// ---

				if ( this.nextStage === this.stages.length ) {

					await this.fillLogo();

					this.active 			= false; 
					this.curentStage 	= 0;

					// this.$emit('complete')

				} else {

					this.curentStage = this.nextStage;

					if ( this.controllable === false ) this.changeStage(this.nextStage);

					// this.$emit('next-stage')

				}

				// ---

				this.idle = true;

			},

			animateText(params: KeyframeAnimationOptions): Promise<boolean> {
				
				return new Promise((resolve, reject) => {

					const el = (this.$refs.stage as HTMLElement);

					if ( !el ) reject(false);

					const animation = el.animate([
						{ opacity: 0 },
						{ opacity: 1 },
					], {
						easing: 'ease-in-out',
						fill: 'both',

						...params
						
					})

					animation.onfinish = () => resolve(true);

				})

			},

			pathlineDash(params: AnimeParams): Promise<boolean> {

				return new Promise((resolve) => {

					this.$AnimeJS({
						targets: this.$refs.path,	
						easing: 'easeInOutQuad',
						round: 1,
						strokeDashoffset: this.segmentCoord,
						stroke: { value: ICON_COLOR_VARIABLE, duration: 250 },
						
						...params,

						complete: () => resolve(true),
						
					})

				})

			},

			fillLogo(): Promise<boolean> {

				console.log('fillLogo start')

				return new Promise((resolve, reject) => {

					const el = (this.$refs.svg as SVGElement);

					if ( !el ) reject(false);

					console.log('fillLogo animation start', el)

					const animation = el.animate([
						{ fill: 'rgba(var(--color-mono-900), 0)' },
						{ fill: 'rgba(var(--color-mono-900), 1)' },
					], {
						duration	: 500,
						endDelay	: 1000,
						easing		: 'ease-in-out',
						fill			: 'forwards'
					})

					animation.onfinish = () => resolve(true);

				}) 

			}

		}
	})

</script>

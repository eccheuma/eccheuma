<template>
	
	<transition name="LoaderTransition">
		<div v-show="active" class="page_loader-container">

			<section>

			</section>

			<section>
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

			<section>
				<p>
					As by lenore horror upon myself on. Or sent marvelled door entrance, was one thy a my stately was much. A followed the quaint oer all and soul, nevernevermore lent not his from, is on here ah answer rare. The entreating then take the tapping and fancy utters. That before perched melancholy this the separate whose nepenthe. Lenore it to lost my is tapping whom...
				</p>
			</section>

		</div>
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
			rows: 1fr 1fr 1fr;
			columns: 100%;
		};

		background:
			radial-gradient(farthest-side, rgb(var(--color-mono-200), .5) 0%, rgb(var(--color-mono-200), .9) 85%), 
			url(~assets/images/Stripes.png?size=15);
		backdrop-filter: blur(12px);

		section {
			display: grid;
			place-content: center;
		}

		&:after {
			content: '';

			position: absolute;
			width: calc(100% - 2vw);
			height: calc(100% - 4vh);

			border-radius: var(--border-radius);

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

		p {

			align-self: center;
			justify-self: center;

			text-align: center;
			width: clamp(160px, 75%, 65ch);

			color: rgba(var(--color-mono-500));
			font: {
				size: var(--font-size-12);
			}

		}

	}

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from "vue";

	// TYPES
	import type { AnimeParams } from "animejs";

	export type LoadStage = { LoadPoint: number, Message: string }

	// VARIABLES
	const ICON_COLOR_VARIABLE = "rgb(var(--color-mono-900))";
	const STAGE_TIME_DURATION = 300;
	const ANIMATION_DURATION_MS = 100;

	// MODULE
	export default Vue.extend({
		props: {
			stages: {
				type: Array,
				default() {
					return [
						{ LoadPoint: 0, 	Message: "Подготовка" },
						{ LoadPoint: 100, Message: "Готово" },
					];
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

				ashed: false,

			}; 
		},
		computed: {

			nextStage(): number {
				return this.curentStage < this.stages.length 
					? this.curentStage + 1 
					: this.stages.length;
			},

			segmentLength(): number {
				return this.dash / this.stages.length;
			},

			segmentCoord(): [number, number] {

				return [
					this.segmentLength * ( this.stages.length - ( this.curentStage / 2 )),
					this.segmentLength * ( this.stages.length - ( this.nextStage / 2 ))
				];

			}

		},
		watch: {
			forcedStage: {
				handler(stage: number) {

					if ( !this.active ) this.active = true;

					if ( !this.ashed ) this.ashed = true;

					// After each force stage change, add func in microtask queue 
					// to not interrupt already running loader stage
					if ( this.idle === true ) {

						queueMicrotask(() => this.changeStage(stage));

					} else {
						const idleWathcer = this.$watch("idle", (value) => {
							if (value) {
								queueMicrotask(() => this.changeStage(stage)); idleWathcer();
							}
						});
					}

				}
			},
			active: {
				handler() {
					setTimeout(() => { this.active = false; }, this.timeLimit );
				}
			}
		},
		mounted() {

			if ( this.ignite ) {
				this.changeStage(0);
			}

			if ( this.$refs.path ) {
				this.dash = this.$AnimeJS.setDashoffset(this.$refs.path as SVGElement);
			}

		},
		methods: {

			async changeStage(stage = 0) {

				this.idle = false;

				if ( stage === 0 && this.ashed ) {
					this.fillLogo({ direction: "reverse", duration: 0, endDelay: 0 });
				}

				const stageDurationFN = () => Math.trunc(STAGE_TIME_DURATION * 2 - (STAGE_TIME_DURATION * Math.random()));
				
				// ---

				// console.log('await block start')

				await this.animateText({ direction: "normal",  duration: ANIMATION_DURATION_MS });
				await this.pathlineDash({ direction: "normal", duration: stageDurationFN() });
				await this.animateText({ direction: "reverse", duration: ANIMATION_DURATION_MS });

				// console.log('await block end')

				// ---

				if ( this.nextStage === this.stages.length ) {

					await this.fillLogo({ playbackRate: 1 });

					this.active 			= false; 
					this.curentStage 	= 0;

					// this.$emit('complete')

				} else {

					this.curentStage = this.nextStage;

					if ( this.controllable === false ) this.changeStage(stage + 1);

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
						easing: "ease-in-out",
						fill: "both",

						...params
						
					});

					animation.onfinish = () => resolve(true);

				});

			},

			pathlineDash(params: AnimeParams): Promise<boolean> {

				return new Promise((resolve) => {

					this.$AnimeJS({
						targets: this.$refs.path,	
						easing: "easeInOutQuad",
						round: 1,
						strokeDashoffset: this.segmentCoord,
						stroke: { value: ICON_COLOR_VARIABLE, duration: ANIMATION_DURATION_MS },
						
						...params,

						complete: () => resolve(true),
						
					});

				});

			},

			fillLogo(params: KeyframeAnimationOptions): Promise<boolean> {

				return new Promise((resolve, reject) => {

					const el = (this.$refs.svg as SVGElement);

					if ( !el ) reject(false);

					const animation = el.animate([
						{ fill: "rgba(var(--color-mono-900), 0)" },
						{ fill: "rgba(var(--color-mono-900), 1)" },
					], {
						duration	: 500,
						endDelay	: 1000,
						easing		: "ease-in-out",
						fill			: "both",

						...params,

					});

					animation.onfinish = () => {
						resolve(true);
					};

				}); 

			}

		}
	});

</script>
